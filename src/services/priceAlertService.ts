/**
 * Real-Time Price Alerting & Notification Engine
 * Manages user-defined asset price thresholds, streaming quote evaluation,
 * Web Browser Notifications, Web Audio synthetic chimes, and ActivityCenter synchronization.
 */

export interface PriceAlert {
  id: string;
  symbol: string;
  assetName: string;
  exchange: 'JSE' | 'NGX' | 'NSE' | 'EGX' | 'BRVM';
  currency: string;
  condition: 'GREATER_EQUAL' | 'LESS_EQUAL';
  targetPrice: number;
  initialPrice: number;
  currentPrice: number;
  status: 'ARMED' | 'TRIGGERED' | 'PAUSED';
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  triggeredAt?: string;
  triggeredPrice?: number;
  triggerAction: 'NOTIFICATION_ONLY' | 'AUTO_ALGO_TWAP' | 'AUTO_ALGO_VWAP' | 'AUTO_ALGO_ICEBERG';
  notes?: string;
}

export interface PriceAlertActivityRecord {
  id: string;
  type: 'Price Alert';
  asset: string;
  time: string;
  amount: number;
  performance: number | null;
  details: string;
  counterparty?: string;
  alertId: string;
  condition: string;
  targetPrice: number;
  triggeredPrice: number;
  currency: string;
}

const STORAGE_KEY_ALERTS = 'nxg_algorithmic_price_alerts_v1';
const STORAGE_KEY_ACTIVITIES = 'nxg_price_alert_activities_v1';

// Seed initial institutional reference alerts
const DEFAULT_ALERTS: PriceAlert[] = [
  {
    id: 'ALERT-8801',
    symbol: 'JSE:SBK (Standard Bank)',
    assetName: 'Standard Bank Group',
    exchange: 'JSE',
    currency: 'ZAR',
    condition: 'GREATER_EQUAL',
    targetPrice: 215.00,
    initialPrice: 208.50,
    currentPrice: 208.50,
    status: 'ARMED',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    triggerAction: 'AUTO_ALGO_TWAP',
    notes: 'Resistance breakout trigger. Fire TWAP slice across 45 min on break.'
  },
  {
    id: 'ALERT-8802',
    symbol: 'JSE:NPN (Naspers Ltd)',
    assetName: 'Naspers Ltd',
    exchange: 'JSE',
    currency: 'ZAR',
    condition: 'GREATER_EQUAL',
    targetPrice: 3450.00,
    initialPrice: 3420.50,
    currentPrice: 3420.50,
    status: 'ARMED',
    priority: 'CRITICAL',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    triggerAction: 'AUTO_ALGO_VWAP',
    notes: 'Intraday VWAP divergence trigger.'
  },
  {
    id: 'ALERT-8803',
    symbol: 'NGX:DANGCEM (Dangote)',
    assetName: 'Dangote Cement PLC',
    exchange: 'NGX',
    currency: 'NGN',
    condition: 'LESS_EQUAL',
    targetPrice: 665.00,
    initialPrice: 680.00,
    currentPrice: 680.00,
    status: 'ARMED',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    triggerAction: 'AUTO_ALGO_ICEBERG',
    notes: 'Support level pullback buy limit order.'
  },
  {
    id: 'ALERT-8804',
    symbol: 'NSE:SCOM (Safaricom)',
    assetName: 'Safaricom PLC',
    exchange: 'NSE',
    currency: 'KES',
    condition: 'GREATER_EQUAL',
    targetPrice: 19.80,
    initialPrice: 18.90,
    currentPrice: 18.90,
    status: 'ARMED',
    priority: 'NORMAL',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    triggerAction: 'NOTIFICATION_ONLY',
    notes: 'M-Pesa transaction volume quarterly announcement threshold.'
  }
];

class PriceAlertEngine {
  private alerts: PriceAlert[] = [];
  private listeners: Array<(alerts: PriceAlert[]) => void> = [];
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadAlerts();
  }

  private loadAlerts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ALERTS);
      if (stored) {
        this.alerts = JSON.parse(stored);
      } else {
        this.alerts = DEFAULT_ALERTS;
        this.saveAlerts();
      }
    } catch {
      this.alerts = DEFAULT_ALERTS;
    }
  }

  private saveAlerts() {
    try {
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(this.alerts));
    } catch (e) {
      console.warn('Unable to persist price alerts to localStorage:', e);
    }
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn([...this.alerts]));
  }

  public subscribe(fn: (alerts: PriceAlert[]) => void) {
    this.listeners.push(fn);
    fn([...this.alerts]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  public getAlerts(): PriceAlert[] {
    return [...this.alerts];
  }

  public createAlert(alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>): PriceAlert {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `ALERT-${Math.floor(Math.random() * 9000 + 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'ARMED'
    };

    this.alerts = [newAlert, ...this.alerts];
    this.saveAlerts();
    return newAlert;
  }

  public togglePauseAlert(alertId: string): void {
    this.alerts = this.alerts.map(a => {
      if (a.id === alertId) {
        const nextStatus = a.status === 'PAUSED' ? 'ARMED' : a.status === 'ARMED' ? 'PAUSED' : a.status;
        return { ...a, status: nextStatus };
      }
      return a;
    });
    this.saveAlerts();
  }

  public resetAlert(alertId: string): void {
    this.alerts = this.alerts.map(a => {
      if (a.id === alertId) {
        return { ...a, status: 'ARMED', triggeredAt: undefined, triggeredPrice: undefined };
      }
      return a;
    });
    this.saveAlerts();
  }

  public deleteAlert(alertId: string): void {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
    this.saveAlerts();
  }

  /**
   * Request Desktop Browser Notification Permissions
   */
  public async requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      const res = await Notification.requestPermission();
      return res;
    } catch {
      return 'denied';
    }
  }

  public getNotificationPermission(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Play crisp institutional multi-tone chime via Web Audio API
   */
  public playChime(isCritical: boolean = false) {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Note 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(isCritical ? 987.77 : 880, now); // B5 or A5
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(isCritical ? 1318.51 : 1174.66, now + 0.12); // E6 or D6
      gain2.gain.setValueAtTime(0.22, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio chime could not be synthesized:', e);
    }
  }

  /**
   * Fire browser notification
   */
  public dispatchBrowserNotification(alert: PriceAlert, actualPrice: number) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      const title = `🚨 [AQX PRICE ALERT] ${alert.symbol} Threshold Triggered!`;
      const conditionText = alert.condition === 'GREATER_EQUAL' ? 'surpassed' : 'fell below';
      const body = `${alert.assetName} has ${conditionText} target ${alert.currency} ${alert.targetPrice.toFixed(2)} (Actual: ${alert.currency} ${actualPrice.toFixed(2)}). Action: ${alert.triggerAction}`;

      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: alert.id,
        requireInteraction: alert.priority === 'CRITICAL'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (e) {
      console.warn('Failed to display browser notification:', e);
    }
  }

  /**
   * Trigger an alert (either via tick evaluation or user manual test)
   */
  public triggerAlert(alertId: string, actualPrice: number): PriceAlert | null {
    let triggeredItem: PriceAlert | null = null;

    this.alerts = this.alerts.map(a => {
      if (a.id === alertId) {
        triggeredItem = {
          ...a,
          status: 'TRIGGERED',
          currentPrice: actualPrice,
          triggeredPrice: actualPrice,
          triggeredAt: new Date().toISOString()
        };
        return triggeredItem;
      }
      return a;
    });

    if (triggeredItem) {
      this.saveAlerts();

      // 1. Audio chime
      this.playChime((triggeredItem as PriceAlert).priority === 'CRITICAL');

      // 2. Browser notification
      this.dispatchBrowserNotification(triggeredItem, actualPrice);

      // 3. Log to Activity Center repository
      this.recordActivityCenterEvent(triggeredItem, actualPrice);

      // 4. Dispatch custom window events for immediate DOM reactive listeners
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('nxg_price_alert_triggered', {
            detail: { alert: triggeredItem, actualPrice }
          })
        );
      }

      // 5. Fire dispatch to multi-channel webhook backend if configured
      this.dispatchToWebhookBackend(triggeredItem, actualPrice);
    }

    return triggeredItem;
  }

  /**
   * Save triggered alert into the shared Activity Center storage
   */
  private recordActivityCenterEvent(alert: PriceAlert, actualPrice: number) {
    try {
      const deviation = (((actualPrice - alert.initialPrice) / alert.initialPrice) * 100).toFixed(2);
      const isPositive = Number(deviation) >= 0;

      const activityRecord: PriceAlertActivityRecord = {
        id: `act-alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'Price Alert',
        asset: `${alert.symbol} [${alert.condition === 'GREATER_EQUAL' ? '▲ RESISTANCE' : '▼ SUPPORT'}]`,
        time: 'Just now',
        amount: actualPrice,
        performance: parseFloat(deviation),
        details: `Real-time price threshold breached: Target ${alert.currency} ${alert.targetPrice.toFixed(2)} hit at ${alert.currency} ${actualPrice.toFixed(2)} (${isPositive ? '+' : ''}${deviation}%). Action: ${alert.triggerAction.replace(/_/g, ' ')}. ${alert.notes || ''}`,
        counterparty: `${alert.exchange} Exchange Matching Engine`,
        alertId: alert.id,
        condition: alert.condition,
        targetPrice: alert.targetPrice,
        triggeredPrice: actualPrice,
        currency: alert.currency
      };

      const existingActivitiesJson = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      const existingActivities: PriceAlertActivityRecord[] = existingActivitiesJson
        ? JSON.parse(existingActivitiesJson)
        : [];

      const updatedActivities = [activityRecord, ...existingActivities.slice(0, 49)];
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updatedActivities));

      // Broadcast activity update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('nxg_activity_added', {
            detail: activityRecord
          })
        );
      }
    } catch (e) {
      console.warn('Error recording alert to ActivityCenter:', e);
    }
  }

  /**
   * Send to server-side webhook router for Telegram / Discord / Twilio
   */
  private async dispatchToWebhookBackend(alert: PriceAlert, actualPrice: number) {
    try {
      await fetch('/api/integrations/alert/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'telegram',
          alertType: 'AQEI_ALPHA_SIGNAL',
          title: `PRICE ALERT: ${alert.symbol}`,
          message: `${alert.assetName} crossed target ${alert.currency} ${alert.targetPrice.toFixed(2)}. Current: ${alert.currency} ${actualPrice.toFixed(2)}. Priority: ${alert.priority}.`,
          priority: alert.priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH'
        })
      });
    } catch {
      // Best-effort dispatch
    }
  }

  /**
   * Process streaming quote ticks
   */
  public updateQuotes(symbolPriceMap: Record<string, number>): PriceAlert[] {
    const newlyTriggered: PriceAlert[] = [];

    this.alerts = this.alerts.map(alert => {
      // Check if price is provided for this symbol or key
      const current = symbolPriceMap[alert.symbol] || symbolPriceMap[alert.assetName];
      if (current === undefined) return alert;

      const updatedAlert: PriceAlert = { ...alert, currentPrice: current };

      if (alert.status === 'ARMED') {
        const hasHitThreshold =
          (alert.condition === 'GREATER_EQUAL' && current >= alert.targetPrice) ||
          (alert.condition === 'LESS_EQUAL' && current <= alert.targetPrice);

        if (hasHitThreshold) {
          const triggered: PriceAlert = {
            ...updatedAlert,
            status: 'TRIGGERED',
            triggeredAt: new Date().toISOString(),
            triggeredPrice: current
          };
          newlyTriggered.push(triggered);
          return triggered;
        }
      }

      return updatedAlert;
    });

    if (newlyTriggered.length > 0) {
      this.saveAlerts();
      newlyTriggered.forEach(item => {
        this.playChime(item.priority === 'CRITICAL');
        this.dispatchBrowserNotification(item, item.currentPrice);
        this.recordActivityCenterEvent(item, item.currentPrice);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('nxg_price_alert_triggered', {
              detail: { alert: item, actualPrice: item.currentPrice }
            })
          );
        }
        this.dispatchToWebhookBackend(item, item.currentPrice);
      });
    } else {
      this.saveAlerts();
    }

    return newlyTriggered;
  }

  /**
   * Fetch all price alert activities for ActivityCenter
   */
  public getRecordedActivities(): PriceAlertActivityRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear recorded activities
   */
  public clearRecordedActivities() {
    localStorage.removeItem(STORAGE_KEY_ACTIVITIES);
  }
}

export const priceAlertService = new PriceAlertEngine();

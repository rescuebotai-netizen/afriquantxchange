import React, { useState, useEffect } from 'react';
import { Cpu, Play, Pause, Settings, Activity, Zap, Clock, Shield, Database, Globe, Loader2, Plus, CheckCircle2, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateAgentLogs } from '../services/geminiService';

interface AgentLog {
  time: string;
  agent: string;
  action: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Agent {
  name: string;
  status: string;
  type: string;
  lastRun: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  tasks: Task[];
}

export function AutonomousAgents() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const [agents, setAgents] = useState<Agent[]>([
    { name: 'Market Sentiment Monitor', status: 'Running', type: 'News Tracking', lastRun: '2 mins ago', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10', tasks: [{ id: '1', title: 'Scan Bloomberg for tech news', completed: true }, { id: '2', title: 'Analyze Twitter sentiment', completed: false }] },
    { name: 'SEC Filings Analyzer', status: 'Running', type: 'Data Extraction', lastRun: '15 mins ago', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10', tasks: [{ id: '3', title: 'Extract 10-K data for AAPL', completed: false }] },
    { name: 'Portfolio Risk Assessor', status: 'Paused', type: 'Financial Analysis', lastRun: '1 day ago', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10', tasks: [] },
    { name: 'Earnings Call Summarizer', status: 'Scheduled', type: 'NLP Processing', lastRun: 'N/A', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10', tasks: [] }
  ]);

  const fetchLogs = async () => {
    setIsLoading(true);
    const data = await generateAgentLogs("Recent market volatility in the tech sector");
    setLogs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !selectedAgent) return;
    
    const updatedAgents = agents.map(agent => {
      if (agent.name === selectedAgent.name) {
        const newTask = { id: Date.now().toString(), title: newTaskTitle, completed: false };
        const updatedAgent = { ...agent, tasks: [...agent.tasks, newTask] };
        setSelectedAgent(updatedAgent);
        return updatedAgent;
      }
      return agent;
    });
    
    setAgents(updatedAgents);
    setNewTaskTitle('');
  };

  const handleToggleTask = (taskId: string) => {
    if (!selectedAgent) return;

    const updatedAgents = agents.map(agent => {
      if (agent.name === selectedAgent.name) {
        const updatedTasks = agent.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const updatedAgent = { ...agent, tasks: updatedTasks };
        setSelectedAgent(updatedAgent);
        return updatedAgent;
      }
      return agent;
    });

    setAgents(updatedAgents);
  };

  return (
    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl flex flex-col overflow-hidden relative backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 inset-x-0 h-1 bg-purple-500" />
      
      <div className="p-6 border-b border-white/10 bg-white/[0.01] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-white/10">
            <Cpu className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight text-xl">Autonomous Agents</h2>
            <p className="text-sm text-zinc-400 mt-1">Manage AI agents executing background financial workflows.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-xl text-sm font-bold transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Deploy New Agent
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {/* Active Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {agents.map((agent, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer" onClick={() => setSelectedAgent(agent)}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${agent.bg} flex items-center justify-center border border-white/5`}>
                    {React.createElement(agent.icon as any, { className: `w-5 h-5 ${agent.color}` })}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-md group-hover:text-purple-400 transition-colors">{agent.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{agent.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className={`p-1.5 rounded-lg transition-colors ${
                    agent.status === 'Running' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  }`}>
                    {agent.status === 'Running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 p-3 bg-black/20 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    agent.status === 'Running' ? 'bg-emerald-500 animate-pulse' : 
                    agent.status === 'Paused' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-xs font-medium text-zinc-300">{agent.status}</span>
                </div>
                <span className="text-[10px] text-zinc-500">Last run: {agent.lastRun}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Agent Orchestration Log */}
        <div className="p-6 rounded-2xl bg-purple-500/5 border border-white/10 relative overflow-hidden">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 relative z-10">
            <Activity className="w-4 h-4 text-purple-400" />
            Orchestration Log (Live)
          </h3>
          <div className="space-y-3 relative z-10 font-mono text-xs">
            {isLoading ? (
              <div className="flex items-center gap-2 text-zinc-400 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                Agents are analyzing current market conditions...
              </div>
            ) : (
              <>
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="text-zinc-500 shrink-0">[{log.time}]</span>
                    <span className={`font-bold shrink-0 w-48 ${log.color}`}>{log.agent}:</span>
                    <span className="text-zinc-300">{log.action}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-zinc-500 p-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  Awaiting next event...
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Task Management Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              onClick={() => setSelectedAgent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-purple-500" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${selectedAgent.bg} flex items-center justify-center border border-white/5`}>
                    {React.createElement(selectedAgent.icon as any, { className: `w-6 h-6 ${selectedAgent.color}` })}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedAgent.name}</h2>
                    <p className="text-sm text-zinc-400">Task Management</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAgent(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {selectedAgent.tasks.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    No tasks assigned to this agent yet.
                  </div>
                ) : (
                  selectedAgent.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group">
                      <button 
                        onClick={() => handleToggleTask(task.id)}
                        className={`shrink-0 transition-colors ${task.completed ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <span className={`flex-1 text-sm ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    placeholder="Assign a new task..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
                  />
                  <button 
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim()}
                    className="px-4 py-2.5 bg-purple-500 hover:bg-purple-400 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

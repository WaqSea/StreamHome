import React, { useEffect, useState } from 'react';
import { GlassPane } from '../../../components/ui/GlassPane';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/ProgressBar';

interface DownloadTask {
  id: string;
  status: 'downloading' | 'completed' | 'failed' | 'pending';
  progress: number;
  speed?: string;
  eta?: string;
  title: string;
}

export function DownloadsPanel() {
  const [tasks, setTasks] = useState<DownloadTask[]>([]);

  useEffect(() => {
    // In a real app this would be:
    // const eventSource = new EventSource('/api/downloads/stream');
    // eventSource.onmessage = (e) => setTasks(JSON.parse(e.data));
    // return () => eventSource.close();

    // Mocking for UI
    setTasks([
      { id: '1', title: 'Inception (2010) [4K]', status: 'downloading', progress: 45.2, speed: '12.5 MB/s', eta: '4m 12s' },
      { id: '2', title: 'The Matrix (1999) [1080p]', status: 'pending', progress: 0 },
      { id: '3', title: 'Interstellar (2014) [4K]', status: 'completed', progress: 100 }
    ]);
  }, []);

  const handleDelete = (id: string) => {
    // Replace with API call to DELETE /api/downloads/:id
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="font-[family-name:var(--font-headline)] text-2xl font-semibold">Download Queue</h2>
          <p className="font-[family-name:var(--font-mono)] text-[var(--text-muted)] text-sm mt-1 uppercase">Monitor active ingestion tasks</p>
        </div>
        <Button variant="secondary" onClick={() => setTasks([])}>Clear Completed</Button>
      </div>

      <div className="flex flex-col gap-4">
        {tasks.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)] font-[family-name:var(--font-mono)]">
            No active downloads
          </div>
        ) : (
          tasks.map(task => (
            <GlassPane key={task.id} className="p-6 flex flex-col gap-4" spotlight={false}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-[family-name:var(--font-body)] text-lg text-white font-medium">{task.title}</h3>
                  <div className="flex gap-4 mt-2 font-[family-name:var(--font-mono)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                    <span>Status: <span className={
                      task.status === 'downloading' ? 'text-blue-400' :
                      task.status === 'completed' ? 'text-green-400' :
                      task.status === 'failed' ? 'text-red-400' : 'text-gray-400'
                    }>{task.status}</span></span>
                    {task.speed && <span>Speed: {task.speed}</span>}
                    {task.eta && <span>ETA: {task.eta}</span>}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  className="text-[var(--text-error)] hover:bg-[var(--text-error)] hover:text-white"
                >
                  Cancel
                </Button>
              </div>
              
              <ProgressBar progress={task.progress} />
            </GlassPane>
          ))
        )}
      </div>
    </div>
  );
}

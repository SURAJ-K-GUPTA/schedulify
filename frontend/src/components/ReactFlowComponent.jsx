import React, { useCallback } from 'react';
import Reactflow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import LeadSource from './LeadSource';
import CustomEdge from './CustomEdge';
import LeadSourceNodeCreator from './LeadSourceNodeCreator';
import EmailBody from './EmailBody';
import EmailBodyNodeCreator from './EmailBodyNodeCreator';
import DelayInputNodeCreator from './DelayInputNodeCreator';
import DelayNode from './DelayNode';

const nodeTypes = {
  leadSource: LeadSource,
  emailBody: EmailBody,
  delayNode: DelayNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const ReactFlowComponent = () => {
  const initialNodes = JSON.parse(localStorage.getItem("rf-nodes")) || [];
  const initialEdges = JSON.parse(localStorage.getItem("rf-edges")) || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync with localStorage
  React.useEffect(() => {
    localStorage.setItem("rf-nodes", JSON.stringify(nodes));
    localStorage.setItem("rf-edges", JSON.stringify(edges));
  }, [nodes, edges]);

  const onConnect = useCallback((connection) => {
    const edge = {
      ...connection,
      type: 'customEdge',
      animated: true,
      id: `${connection.source}-${connection.target}`,
    };
    setEdges((prevEdges) => addEdge(edge, prevEdges));
  }, [setEdges]);

  const handleSchedule = async () => {
    const token = localStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
    if (!token) {
      alert("⚠️ No JWT token found in localStorage!");
      return;
    }
  
    try {
      const leadNodes = nodes.filter((n) => n.type === 'leadSource');
      const emailNodes = nodes.filter((n) => n.type === 'emailBody');
      const delayNodes = nodes.filter((n) => n.type === 'delayNode');
  
      let scheduledCount = 0;
  
      for (const lead of leadNodes) {
        // Get all email nodes connected to this lead node
        const emailEdges = edges.filter((e) => e.source === lead.id && emailNodes.some((en) => en.id === e.target));
  
        for (const emailEdge of emailEdges) {
          const email = nodes.find((n) => n.id === emailEdge.target && n.type === 'emailBody');
  
          if (!email) continue;
  
          // Get all delay nodes connected to this email node
          const delayEdges = edges.filter((e) => e.source === email.id && delayNodes.some((dn) => dn.id === e.target));
  
          for (const delayEdge of delayEdges) {
            const delay = nodes.find((n) => n.id === delayEdge.target && n.type === 'delayNode');
  
            if (!delay) continue;
  
            const payload = {
              email: lead.data.email,
              subject: email.data.subject,
              emailBody: email.data.emailBody,
              time: delay.data.delayTime,
            };
  
            const res = await fetch(`${backendUrl}/api/schedule`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            });
  
            const result = await res.json();
  
            if (res.ok) {
              console.log(`✅ Scheduled: ${result.message}`);
              scheduledCount++;
            } else {
              console.error(`❌ Error scheduling: ${result.message}`);
            }
          }
        }
      }
  
      if (scheduledCount > 0) {
        alert(`🎯 Successfully scheduled ${scheduledCount} email(s).`);
      } else {
        alert('⚠️ No valid Lead ➝ Email ➝ Delay paths found!');
      }
  
    } catch (err) {
      alert('Something went wrong: ' + err.message);
    }
  };
  
  

  return (
    <div className="w-screen h-screen pt-20">
      <Reactflow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={false}
        defaultViewport={{ x: 0, y: 0, zoom: 0.3 }}
      >
        <Background variant="cross" gap={12} />
        <MiniMap />
        <Controls />
        <Panel position="top-left"><LeadSourceNodeCreator setNodes={setNodes} /></Panel>
        <Panel position="top-right"><EmailBodyNodeCreator setNodes={setNodes} /></Panel>
        <Panel position="bottom-left"><DelayInputNodeCreator setNodes={setNodes} /></Panel>

        {/* ✅ SCHEDULE BUTTON */}
        <Panel position="bottom-center">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700 cursor-pointer"
            onClick={handleSchedule}
          >
            📤 Schedule Email
          </button>
        </Panel>
      </Reactflow>
    </div>
  );
};

export default ReactFlowComponent;

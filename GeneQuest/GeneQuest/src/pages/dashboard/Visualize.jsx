import React, { useState, useRef, useEffect } from 'react';
import { Upload, Info } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ThreeDVisualization({ sequence }) {
  const points = sequence.split('').map((base, i) => {
    const theta = (i / sequence.length) * Math.PI * 2;
    const y = i * 0.1;
    const radius = 2;
    return new THREE.Vector3(
      radius * Math.cos(theta),
      y,
      radius * Math.sin(theta)
    );
  });

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial color="#00ff00" />
    </mesh>
  );
}

function Visualize() {
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('2d');
  const [sequence, setSequence] = useState(null);
  const canvasRef = useRef(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      console.log('File uploaded:', uploadedFile.name);
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        console.log('File content loaded, length:', content.length);
        
        const mockSequence = {
          id: uploadedFile.name,
          sequence: content || 'ATCGATCGATCG',
          length: content ? content.length : 12,
          type: uploadedFile.name.endsWith('.fasta') ? 'FASTA' : 'VCF'
        };
        console.log('Setting sequence:', mockSequence);
        setSequence(mockSequence);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleMockUpload = () => {
    const mockSequence = {
      id: 'test.fasta',
      sequence: 'ATCGATCGATCGATCGATCG',
      length: 20,
      type: 'FASTA'
    };
    setFile(new File([''], 'test.fasta', { type: 'text/plain' }));
    setSequence(mockSequence);
  };

  useEffect(() => {
    if (canvasRef.current && sequence && activeTab === '2d') {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.beginPath();
        sequence.sequence.split('').forEach((base, i) => {
          const x = (i % 100) * 8;
          const y = Math.floor(i / 100) * 20;
          ctx.fillStyle = base === 'A' ? '#ff0000' : 
                         base === 'T' ? '#00ff00' :
                         base === 'C' ? '#0000ff' :
                         base === 'G' ? '#ffff00' : '#999999';
          ctx.fillRect(x, y, 6, 16);
        });
      }
    }
  }, [sequence, activeTab]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-3xl mb-8">Visualizer</h1>
      
      {/* File Upload Section */}
      <div className="mb-8">
        <div className="max-w-xl mx-auto">
          <label 
            className="flex flex-col items-center px-4 py-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <Upload className="w-12 h-12 mb-2" />
            <span className="text-lg">Upload FASTA/VCF file</span>
            <input
              type="file"
              className="hidden"
              accept=".fasta,.vcf"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={handleMockUpload}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors w-full"
          >
            Test with Mock Data
          </button>
          {file && (
            <p className="mt-2 text-center text-gray-400">
              Uploaded: {file.name}
            </p>
          )}
        </div>
      </div>

      {/* Visualization Tabs */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === '2d' ? 'bg-blue-600' : 'bg-gray-700'
            } ${!sequence && 'opacity-50 cursor-not-allowed'}`}
            onClick={() => setActiveTab('2d')}
            disabled={!sequence}
          >
            2D View
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === '3d' ? 'bg-blue-600' : 'bg-gray-700'
            } ${!sequence && 'opacity-50 cursor-not-allowed'}`}
            onClick={() => setActiveTab('3d')}
            disabled={!sequence}
          >
            3D View
          </button>
        </div>

        {/* Visualization Area */}
        <div className="bg-gray-800 rounded-lg p-4 h-[400px]">
          {!sequence ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Upload a file to view visualization
            </div>
          ) : activeTab === '2d' ? (
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-full"
            />
          ) : (
            <Canvas camera={{ position: [0, 5, 10] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <ThreeDVisualization sequence={sequence.sequence} />
              <OrbitControls />
            </Canvas>
          )}
        </div>
      </div>

      {/* Sequence Information */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-6 h-6" />
          <h2 className="text-xl font-bold">Sequence Information</h2>
        </div>
        {!sequence ? (
          <div className="text-gray-400 text-center py-4">
            Upload a file to view sequence information
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">File Type:</p>
              <p className="font-semibold">{sequence.type}</p>
            </div>
            <div>
              <p className="text-gray-400">Sequence Length:</p>
              <p className="font-semibold">{sequence.length} bp</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400">Sequence Preview:</p>
              <p className="font-mono bg-gray-900 p-2 rounded mt-1">
                {sequence.sequence.slice(0, 100)}...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Visualize;
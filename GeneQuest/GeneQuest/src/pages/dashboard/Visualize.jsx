import React, { useState, useRef, useEffect } from 'react';
import { Upload, Info } from 'lucide-react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

import PropTypes from 'prop-types';

function Annotation({ position, content, distance }) {
  const { camera } = useThree();
  const [isVisible, setIsVisible] = useState(false);
  
  useFrame(() => {
    const distanceToCamera = position.distanceTo(camera.position);
    setIsVisible(distanceToCamera < distance);
  });

  if (!isVisible) return null;

  return (
    <Html position={[position.x, position.y, position.z]}>
      <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm whitespace-nowrap transform transition-opacity duration-200">
        {content}
      </div>
    </Html>
  );
}

function ThreeDVisualization({ sequence }) {
  // Find important patterns in the sequence
  const findPatterns = (seq) => {
    const patterns = [];
    // GC-rich regions (>60% GC content in 8bp window)
    for (let i = 0; i < seq.length - 7; i++) {
      const window = seq.slice(i, i + 8);
      const gcCount = (window.match(/[GC]/g) || []).length;
      if (gcCount / 8 > 0.6) {
        patterns.push({ start: i, end: i + 8, type: 'GC-rich' });
        i += 7; // Skip to avoid overlapping regions
      }
    }
    
    // AT-rich regions (>60% AT content in 8bp window)
    for (let i = 0; i < seq.length - 7; i++) {
      const window = seq.slice(i, i + 8);
      const atCount = (window.match(/[AT]/g) || []).length;
      if (atCount / 8 > 0.6) {
        patterns.push({ start: i, end: i + 8, type: 'AT-rich' });
        i += 7;
      }
    }

    // Repeating sequences (4bp or longer)
    for (let i = 0; i < seq.length - 3; i++) {
      const motif = seq.slice(i, i + 4);
      if (seq.slice(i + 4).includes(motif)) {
        patterns.push({ start: i, end: i + 4, type: 'repeat' });
        i += 3;
      }
    }

    return patterns;
  };

  const patterns = findPatterns(sequence);
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

  const annotations = patterns.map(pattern => {
    const midPoint = Math.floor((pattern.start + pattern.end) / 2);
    const theta = (midPoint / sequence.length) * Math.PI * 2;
    const y = midPoint * 0.1;
    const radius = 2.5; // Slightly outside the helix
    return {
      position: new THREE.Vector3(
        radius * Math.cos(theta),
        y,
        radius * Math.sin(theta)
      ),
      content: `${pattern.type} (${pattern.start}-${pattern.end})`,
      type: pattern.type,
      // Different visibility distances based on pattern type
      distance: pattern.type === 'GC-rich' ? 8 : 
                pattern.type === 'AT-rich' ? 7 :
                6 // Repeating sequences
    };
  });

  // Create separate geometries for different regions
  const createSegmentGeometry = (start, end) => {
    const segmentPoints = points.slice(start, end + 1);
    if (segmentPoints.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(segmentPoints);
    return new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
  };

  const { camera } = useThree();
  const [showLegend, setShowLegend] = useState(true);

  useFrame(() => {
    // Show legend only when zoomed out
    setShowLegend(camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 10);
  });

  return (
    <>
      {/* Base structure */}
      <mesh geometry={new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 100, 0.1, 8, false)}>
        <meshStandardMaterial color="#4a5568" opacity={0.3} transparent />
      </mesh>

      {/* Highlighted regions */}
      {patterns.map((pattern, index) => (
        <mesh key={index} geometry={createSegmentGeometry(pattern.start, pattern.end)}>
          <meshStandardMaterial
            color={
              pattern.type === 'GC-rich' ? '#ff6b6b' :
              pattern.type === 'AT-rich' ? '#4ecdc4' :
              '#ffd93d'
            }
          />
        </mesh>
      ))}

      {/* Annotations with distance-based visibility */}
      {annotations.map((annotation, index) => (
        <Annotation
          key={index}
          position={annotation.position}
          content={annotation.content}
          distance={annotation.distance}
        />
      ))}

      {/* Legend - only visible when zoomed out */}
      {showLegend && (
        <Html position={[-4, 0, 0]}>
          <div className="bg-black bg-opacity-75 text-white p-4 rounded transition-opacity duration-200">
            <h3 className="font-bold mb-2">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#ff6b6b] rounded mr-2"></div>
                <span>GC-rich regions</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#4ecdc4] rounded mr-2"></div>
                <span>AT-rich regions</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#ffd93d] rounded mr-2"></div>
                <span>Repeating sequences</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-300">
              Zoom in to see region details
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

const SequenceDataPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  sequence: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
});

function Visualize() {
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('2d');
  const [sequence, setSequence] = useState(null);
  const [viewMode, setViewMode] = useState('linear');
  const canvasRef = useRef(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      console.log('File uploaded:', uploadedFile.name);
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result || '';
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
      sequence: 'ATCGATCGATCGATCGATCGGGCCGGCCATATATATCGCGCGCGCG',
      length: 45,
      type: 'FASTA'
    };
    setFile(new File([''], 'test.fasta', { type: 'text/plain' }));
    setSequence(mockSequence);
  };

  useEffect(() => {
    if (canvasRef.current && sequence && activeTab === '2d') {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        if (viewMode === 'linear') {
          drawLinearView(ctx, sequence.sequence);
        } else {
          drawCircularView(ctx, sequence.sequence);
        }
      }
    }
  }, [sequence, activeTab, viewMode]);

  const drawLinearView = (ctx, sequence) => {
    if (canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    // Draw base pairs
    sequence.split('').forEach((base, i) => {
      const x = (i % 100) * 8;
      const y = Math.floor(i / 100) * 20 + 30; // Added offset for ruler
      
      // Base colors with gradients
      const gradient = ctx.createLinearGradient(x, y, x + 6, y + 16);
      let colors;
      switch(base) {
        case 'A':
          colors = ['#ff6b6b', '#ff8787'];
          break;
        case 'T':
          colors = ['#4ecdc4', '#66d9e8'];
          break;
        case 'C':
          colors = ['#ffd93d', '#ffe066'];
          break;
        case 'G':
          colors = ['#a8e6cf', '#bff0da'];
          break;
        default:
          colors = ['#868e96', '#adb5bd'];
      }
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, 6, 16);
      
      // Add position markers every 10 bases
      if (i % 10 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText(i.toString(), x, 20);
        ctx.fillRect(x, 25, 1, 3);
      }
    });

    // Add legend
    const legend = [
      { base: 'A', colors: ['#ff6b6b', '#ff8787'], desc: 'Adenine' },
      { base: 'T', colors: ['#4ecdc4', '#66d9e8'], desc: 'Thymine' },
      { base: 'C', colors: ['#ffd93d', '#ffe066'], desc: 'Cytosine' },
      { base: 'G', colors: ['#a8e6cf', '#bff0da'], desc: 'Guanine' }
    ];

    legend.forEach((item, i) => {
      const x = canvasRef.current ? canvasRef.current.width - 150 : 0;
      const y = 20 + i * 25;
      
      const gradient = ctx.createLinearGradient(x, y, x + 20, y + 20);
      gradient.addColorStop(0, item.colors[0]);
      gradient.addColorStop(1, item.colors[1]);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.fillText(item.base + ' - ' + item.desc, x + 30, y + 15);
    });
  };

  const drawCircularView = (ctx, sequence) => {
    if (canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    const centerX = canvasRef.current ? canvasRef.current.width / 2 : 0;
    const centerY = canvasRef.current ? canvasRef.current.height / 2 : 0;
    const radius = Math.min(centerX, centerY) - 50;
    
    sequence.split('').forEach((base, i) => {
      const angle = (i / sequence.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Base colors
      ctx.fillStyle = base === 'A' ? '#ff6b6b' :
                     base === 'T' ? '#4ecdc4' :
                     base === 'C' ? '#ffd93d' :
                     base === 'G' ? '#a8e6cf' : '#868e96';
      
      // Draw base marker
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Add position markers every 10 bases
      if (i % 10 === 0) {
        const textRadius = radius + 20;
        const textX = centerX + Math.cos(angle) * textRadius;
        const textY = centerY + Math.sin(angle) * textRadius;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i.toString(), textX, textY);
      }
    });

    // Add circular legend
    const legend = [
      { base: 'A', color: '#ff6b6b', desc: 'Adenine' },
      { base: 'T', color: '#4ecdc4', desc: 'Thymine' },
      { base: 'C', color: '#ffd93d', desc: 'Cytosine' },
      { base: 'G', color: '#a8e6cf', desc: 'Guanine' }
    ];

    legend.forEach((item, i) => {
      const x = 20;
      const y = 20 + i * 25;
      
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(x + 10, y + 10, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.base + ' - ' + item.desc, x + 25, y + 10);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">DNA Sequence Visualizer</h1>
      
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
          
          {/* 2D View Mode Toggle */}
          {activeTab === '2d' && sequence && (
            <div className="ml-auto flex gap-2">
              <button
                className={`px-4 py-2 rounded ${
                  viewMode === 'linear' ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                onClick={() => setViewMode('linear')}
              >
                Linear View
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  viewMode === 'circular' ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                onClick={() => setViewMode('circular')}
              >
                Circular View
              </button>
            </div>
          )}
        </div>

        {/* Visualization Area */}
        <div className="bg-gray-800 rounded-lg p-4">
          {!sequence ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Upload a file to view visualization
            </div>
          ) : activeTab === '2d' ? (
            <div className="space-y-6">
              {/* Canvas */}
              <div className="h-[400px]">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="w-full h-full"
                />
              </div>

              {/* Visualization Guide */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-gray-900 rounded-lg">
                {/* View-Specific Information */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {viewMode === 'linear' ? 'Linear View' : 'Circular View'} Components
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    {viewMode === 'linear' ? (
                      <>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8787]"></div>
                          <span>Gradient-colored blocks represent individual bases</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white"></div>
                          <span>Position markers every 10 bases along the sequence</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 border border-white"></div>
                          <span>Continuous strand visualization</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#ff6b6b]"></div>
                          <span>Circular dots represent individual bases</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 border border-white"></div>
                          <span>Radial position markers every 10 bases</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-white"></div>
                          <span>Circular genome representation</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Color Coding Guide */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Base Color Guide</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#ff6b6b]"></div>
                        <span className="text-gray-300">Adenine (A)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#4ecdc4]"></div>
                        <span className="text-gray-300">Thymine (T)</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#ffd93d]"></div>
                        <span className="text-gray-300">Cytosine (C)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#a8e6cf]"></div>
                        <span className="text-gray-300">Guanine (G)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px]"> {/* Increased height for 3D view */}
              <Canvas camera={{ position: [0, 8, 15] }}> {/* Adjusted camera position */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <ThreeDVisualization sequence={sequence.sequence} />
                <OrbitControls 
                  minDistance={5}
                  maxDistance={30}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                />
              </Canvas>
            </div>
          )}
        </div>
      </div>

      {/* Sequence Information Card */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Info className="w-6 h-6" />
          <h2 className="text-xl font-bold">Sequence Analysis</h2>
        </div>
        {!sequence ? (
          <div className="text-gray-400 text-center py-4">
            Upload a file to view sequence information
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Information */}
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-4">File Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Format</p>
                  <p className="font-semibold">{sequence.type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Sequence Length</p>
                  <p className="font-semibold">{sequence.length} base pairs</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">File Name</p>
                  <p className="font-semibold">{sequence.id}</p>
                </div>
              </div>
            </div>

            {/* Sequence Preview */}
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Sequence Preview</h3>
              <div className="font-mono bg-gray-950 p-3 rounded text-sm overflow-x-auto">
                {sequence.sequence.slice(0, 100)}
                {sequence.sequence.length > 100 && (
                  <span className="text-gray-500">...</span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Showing first 100 bases of {sequence.length} total
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Annotation.propTypes = {
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  content: PropTypes.string.isRequired,
  distance: PropTypes.number.isRequired,
};

export default Visualize;
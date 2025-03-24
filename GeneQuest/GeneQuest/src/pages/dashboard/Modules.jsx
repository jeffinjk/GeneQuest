import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Dna, FileText, ChevronDown, ChevronRight, ChevronLeft, Award, Sparkles, Microscope, Binary, FlaskRound as Flask, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

// MODULES DATA ARRAY (add your content here)
const modules = [
  {
    id: 1,
    title: 'Introduction to Gene Visualization',
    icon: Dna,
    description: 'Learn the fundamentals of gene visualization and DNA structure',
    subchapters: [
      {
        id: 'sc1',
        title: 'Understanding DNA Sequences',
        flowCards: [
          {
            id: 'fc1',
            title: 'DNA Structure and Components',
            content: 'DNA (Deoxyribonucleic Acid) is the molecule that carries genetic instructions for the development, functioning, growth, and reproduction of all known organisms. It is composed of two strands that coil around each other to form a double helix.',
            image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'DNA Structure', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'Phosphate Group', children: ['n5'] },
              { id: 'n3', text: 'Sugar (Deoxyribose)', children: ['n6'] },
              { id: 'n4', text: 'Nitrogenous Bases', children: ['n7', 'n8', 'n9', 'n10'] },
              { id: 'n5', text: 'Negatively Charged' },
              { id: 'n6', text: '5-Carbon Sugar' },
              { id: 'n7', text: 'Adenine (A)' },
              { id: 'n8', text: 'Thymine (T)' },
              { id: 'n9', text: 'Cytosine (C)' },
              { id: 'n10', text: 'Guanine (G)' }
            ]
          },
          {
            id: 'fc2',
            title: 'Base Pairing Rules',
            content: 'The four DNA bases pair specifically: Adenine (A) with Thymine (T), and Cytosine (C) with Guanine (G). This base pairing is crucial for DNA replication and transcription.',
            image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Base Pairing Rules', children: ['n2', 'n3'] },
              { id: 'n2', text: 'A-T Bond', children: ['n4', 'n5'] },
              { id: 'n3', text: 'C-G Bond', children: ['n6', 'n7'] },
              { id: 'n4', text: '2 Hydrogen Bonds' },
              { id: 'n5', text: 'Weak Bond' },
              { id: 'n6', text: '3 Hydrogen Bonds' },
              { id: 'n7', text: 'Strong Bond' }
            ]
          },
          {
            id: 'fc3',
            title: 'DNA Replication',
            content: 'DNA replication is the biological process of producing two identical replicas of DNA from one original DNA molecule. This process occurs before cell division.',
            image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'DNA Replication', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'Unwinding', children: ['n5'] },
              { id: 'n3', text: 'Base Pairing', children: ['n6'] },
              { id: 'n4', text: 'Synthesis', children: ['n7'] },
              { id: 'n5', text: 'Helicase Enzyme' },
              { id: 'n6', text: 'Complementary Bases' },
              { id: 'n7', text: 'DNA Polymerase' }
            ]
          }
        ]
      },
      {
        id: 'sc2',
        title: 'Visualization Methods',
        flowCards: [
          {
            id: 'fc4',
            title: 'Linear Sequence View',
            content: 'The linear sequence view is the most basic form of DNA visualization, displaying the sequence as a string of letters representing the four nucleotides.',
            image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Linear Sequence', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Forward Strand', children: ['n4', 'n5'] },
              { id: 'n3', text: 'Reverse Strand', children: ['n6', 'n7'] },
              { id: 'n4', text: "5' End" },
              { id: 'n5', text: "3' End" },
              { id: 'n6', text: "3' End" },
              { id: 'n7', text: "5' End" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the structure of DNA?',
        options: ['Single helix', 'Double helix', 'Triple helix', 'Straight line'],
        answer: 'Double helix'
      },
      {
        id: 'q2',
        question: 'Which base pairs with Adenine?',
        options: ['Cytosine', 'Guanine', 'Thymine', 'Another Adenine'],
        answer: 'Thymine'
      },
      {
        id: 'q3',
        question: 'What is the first step of gene expression?',
        options: ['Translation', 'Transcription', 'Replication', 'Mutation'],
        answer: 'Transcription'
      }
    ]
  },
  {
    id: 2,
    title: 'Sequence Analysis Tools',
    icon: Microscope,
    description: 'Explore tools and techniques for analyzing gene sequences',
    subchapters: [
      {
        id: 'sc1',
        title: 'Fundamentals of Sequence Analysis',
        flowCards: [
          {
            id: 'fc1',
            title: 'DNA, RNA, and Protein Sequences',
            content: 'Biological sequences come in three main types: DNA (genetic blueprint), RNA (messenger), and proteins (functional molecules). DNA sequences use A, T, C, G; RNA replaces T with U; proteins use 20 amino acids represented by letters.',
            image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Biological Sequences', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'DNA', children: ['n5'] },
              { id: 'n3', text: 'RNA', children: ['n6'] },
              { id: 'n4', text: 'Proteins', children: ['n7'] },
              { id: 'n5', text: 'A,T,C,G nucleotides' },
              { id: 'n6', text: 'A,U,C,G nucleotides' },
              { id: 'n7', text: '20 amino acids' }
            ]
          },
          {
            id: 'fc2',
            title: 'Sequence Databases',
            content: 'Major databases store biological sequences: GenBank (DNA/RNA), UniProt (proteins), and EMBL-EBI (European counterpart). These contain annotated sequences from thousands of species, searchable by gene names or functions.',
            image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Sequence Databases', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'GenBank', children: ['n5'] },
              { id: 'n3', text: 'UniProt', children: ['n6'] },
              { id: 'n4', text: 'EMBL-EBI', children: ['n7'] },
              { id: 'n5', text: 'DNA/RNA sequences' },
              { id: 'n6', text: 'Protein sequences' },
              { id: 'n7', text: 'European resources' }
            ]
          }
        ]
      },
      {
        id: 'sc2',
        title: 'Analysis Techniques',
        flowCards: [
          {
            id: 'fc3',
            title: 'Sequence Alignment',
            content: 'Alignment compares sequences to identify similarities (homologies) and differences. Pairwise alignment compares two sequences (BLAST), while multiple sequence alignment (Clustal Omega) compares many. Gaps represent insertions/deletions.',
            image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Sequence Alignment', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Pairwise', children: ['n4'] },
              { id: 'n3', text: 'Multiple', children: ['n5'] },
              { id: 'n4', text: 'BLAST tool' },
              { id: 'n5', text: 'Clustal Omega' }
            ]
          },
          {
            id: 'fc4',
            title: 'Variant Analysis',
            content: 'Identifies mutations like SNPs (single nucleotide polymorphisms) and indels. Tools like GATK detect variants, while ANNOVAR predicts their effects. Variants can be benign, pathogenic, or of uncertain significance.',
            image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Variant Types', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'SNPs', children: ['n5'] },
              { id: 'n3', text: 'Insertions', children: ['n6'] },
              { id: 'n4', text: 'Deletions', children: ['n7'] },
              { id: 'n5', text: 'Single base change' },
              { id: 'n6', text: 'Added bases' },
              { id: 'n7', text: 'Removed bases' }
            ]
          }
        ]
      },
      {
        id: 'sc3',
        title: 'Visualization Methods',
        flowCards: [
          {
            id: 'fc5',
            title: 'Genome Browsers',
            content: 'IGV (Integrative Genomics Viewer) provides interactive exploration of sequence data with gene annotations, variants, and coverage tracks. Supports zooming from whole chromosomes to single bases.',
            image: 'https://images.unsplash.com/photo-1581092921461-39b2f2f8a4c6?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'IGV Features', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'Zoomable', children: ['n5'] },
              { id: 'n3', text: 'Tracks', children: ['n6'] },
              { id: 'n4', text: 'Annotations', children: ['n7'] },
              { id: 'n5', text: 'Chromosome → base' },
              { id: 'n6', text: 'Multiple data layers' },
              { id: 'n7', text: 'Gene locations' }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which database would you use to find protein sequences?',
        options: ['GenBank', 'UniProt', 'EMBL-EBI', 'BLAST'],
        answer: 'UniProt'
      },
      {
        id: 'q2',
        question: 'What does BLAST primarily analyze?',
        options: ['Protein structures', 'Pairwise sequence alignments', '3D molecular models', 'Gene expression levels'],
        answer: 'Pairwise sequence alignments'
      },
      {
        id: 'q3',
        question: 'What might a red highlight in IGV typically indicate?',
        options: ['High sequence quality', 'A variant position', 'Gene start site', 'RNA splicing site'],
        answer: 'A variant position'
      },
      {
        id: 'q4',
        question: 'Which tool would you use to compare 10 related DNA sequences simultaneously?',
        options: ['BLAST', 'GATK', 'Clustal Omega', 'ANNOVAR'],
        answer: 'Clustal Omega'
      }
    ]
  },
  {
    id: 3,
    title: 'Bioinformatics Algorithms',
    icon: Binary,
    description: 'Learn key algorithms used in genetic data analysis',
    subchapters: [
      {
        id: 'sc1',
        title: 'Core Algorithm Concepts',
        flowCards: [
          {
            id: 'fc1',
            title: 'Sequence Alignment Algorithms',
            content: 'Two fundamental approaches: Global alignment (Needleman-Wunsch) finds optimal alignment across entire sequences, while local alignment (Smith-Waterman) identifies similar regions. Both use dynamic programming with gap penalties and substitution matrices.',
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Alignment Types', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Global', children: ['n4'] },
              { id: 'n3', text: 'Local', children: ['n5'] },
              { id: 'n4', text: 'Needleman-Wunsch\nO(nm) time' },
              { id: 'n5', text: 'Smith-Waterman\nO(nm) time' }
            ]
          },
          {
            id: 'fc2',
            title: 'Hidden Markov Models',
            content: 'Probabilistic models with hidden states (like gene regions) and observable outputs (DNA bases). Used for gene prediction (GENSCAN), protein family classification (Pfam), and sequence alignment (HMMER).',
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'HMM Components', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'States', children: ['n5'] },
              { id: 'n3', text: 'Transitions', children: ['n6'] },
              { id: 'n4', text: 'Emissions', children: ['n7'] },
              { id: 'n5', text: 'e.g., Exon/Intron' },
              { id: 'n6', text: 'Probability matrix' },
              { id: 'n7', text: 'Base probabilities' }
            ]
          }
        ]
      },
      {
        id: 'sc2',
        title: 'Phylogenetics & Assembly',
        flowCards: [
          {
            id: 'fc3',
            title: 'Phylogenetic Tree Building',
            content: 'Distance-based methods (Neighbor-Joining) use sequence dissimilarity, while character-based methods (Maximum Parsimony) minimize evolutionary changes. Bayesian methods incorporate probability distributions.',
            image: 'https://images.unsplash.com/photo-1563784462041-5f97ac9523dd?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Tree Methods', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'Distance-Based', children: ['n5'] },
              { id: 'n3', text: 'Character-Based', children: ['n6'] },
              { id: 'n4', text: 'Bayesian', children: ['n7'] },
              { id: 'n5', text: 'Neighbor-Joining' },
              { id: 'n6', text: 'Max Parsimony' },
              { id: 'n7', text: 'MrBayes' }
            ]
          },
          {
            id: 'fc4',
            title: 'Genome Assembly',
            content: 'De novo assembly (SPAdes) uses overlap-layout-consensus for novel genomes. Reference-based alignment (BWA) maps reads to existing genomes. Key challenges include repeats and sequencing errors.',
            image: 'https://images.unsplash.com/photo-1581093057305-25ad2a3e0f2c?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Assembly Approaches', children: ['n2', 'n3'] },
              { id: 'n2', text: 'De Novo', children: ['n4'] },
              { id: 'n3', text: 'Reference-Based', children: ['n5'] },
              { id: 'n4', text: 'SPAdes\nVelvet' },
              { id: 'n5', text: 'BWA\nBowtie' }
            ]
          }
        ]
      },
      {
        id: 'sc3',
        title: 'Machine Learning Applications',
        flowCards: [
          {
            id: 'fc5',
            title: 'ML in Bioinformatics',
            content: 'Random Forests classify genomic variants, CNNs analyze medical images, and RNNs predict protein structures (AlphaFold). Feature selection is crucial for high-dimensional biological data.',
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'ML Techniques', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'Supervised', children: ['n5'] },
              { id: 'n3', text: 'Unsupervised', children: ['n6'] },
              { id: 'n4', text: 'Deep Learning', children: ['n7'] },
              { id: 'n5', text: 'SVMs\nRandom Forests' },
              { id: 'n6', text: 'PCA\nClustering' },
              { id: 'n7', text: 'CNNs\nRNNs' }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which algorithm would you use for global sequence alignment?',
        options: ['Smith-Waterman', 'Needleman-Wunsch', 'BLAST', 'ClustalW'],
        answer: 'Needleman-Wunsch'
      },
      {
        id: 'q2',
        question: 'What is the primary use of HMMs in genomics?',
        options: ['Variant calling', 'Gene prediction', 'Protein folding', 'Sequence assembly'],
        answer: 'Gene prediction'
      },
      {
        id: 'q3',
        question: 'Which method builds trees using evolutionary distance matrices?',
        options: ['Maximum Likelihood', 'Neighbor-Joining', 'Bayesian Inference', 'Maximum Parsimony'],
        answer: 'Neighbor-Joining'
      },
      {
        id: 'q4',
        question: 'What distinguishes de novo from reference-based assembly?',
        options: [
          'Use of existing genome',
          'Sequencing technology',
          'Read length requirements',
          'Variant detection'
        ],
        answer: 'Use of existing genome'
      }
    ]
  },
  {
    id: 4,
    title: 'Laboratory Techniques',
    icon: Flask,
    description: 'Understanding common lab procedures in genetics',
    subchapters: [
      {
        id: 'sc1',
        title: 'Essential Lab Skills',
        flowCards: [
          {
            id: 'fc1',
            title: 'Pipetting Techniques',
            content: 'Precision liquid handling using micropipettes (1-1000µL) and serological pipettes (1-25mL). Includes forward/reverse pipetting methods, tip selection, and calibration. Critical for reagent preparation and sample handling.',
            image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Pipette Types', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Micropipettes', children: ['n4'] },
              { id: 'n3', text: 'Serological', children: ['n5'] },
              { id: 'n4', text: '1-1000µL\nP20/P200/P1000' },
              { id: 'n5', text: '1-25mL\nGraduated' }
            ]
          },
          {
            id: 'fc2',
            title: 'Centrifugation',
            content: 'Separation of components by density using centrifugal force. Key parameters: RCF (relative centrifugal force), rotor type (fixed-angle vs swing-bucket), and temperature control. Essential for cell pelleting and nucleic acid isolation.',
            image: 'https://images.unsplash.com/photo-1581093057305-25ad2a3e0f2c?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Centrifuge Types', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Microcentrifuge', children: ['n4'] },
              { id: 'n3', text: 'High-Speed', children: ['n5'] },
              { id: 'n4', text: '1.5-2mL tubes\n<15,000 rpm' },
              { id: 'n5', text: '50mL tubes\n>30,000 rpm' }
            ]
          }
        ]
      },
      {
        id: 'sc2',
        title: 'Molecular Techniques',
        flowCards: [
          {
            id: 'fc3',
            title: 'Gel Electrophoresis',
            content: 'Separation of DNA/RNA/proteins using agarose or polyacrylamide gels. Factors affecting migration: voltage, buffer composition (TAE/TBE), and gel percentage. Visualization with ethidium bromide or SYBR safe.',
            image: 'https://images.unsplash.com/photo-1581092921461-39b2f2f8a4c6?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Gel Types', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Agarose', children: ['n4'] },
              { id: 'n3', text: 'Polyacrylamide', children: ['n5'] },
              { id: 'n4', text: 'DNA separation\n0.8-2% gels' },
              { id: 'n5', text: 'Protein/Small DNA\n5-20% gels' }
            ]
          },
          {
            id: 'fc4',
            title: 'PCR (Polymerase Chain Reaction)',
            content: 'DNA amplification using thermal cycling: denaturation (95°C), annealing (50-65°C), and extension (72°C). Components: template DNA, primers, dNTPs, Taq polymerase. Applications: genotyping, cloning, diagnostics.',
            image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'PCR Steps', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'Denaturation', children: ['n5'] },
              { id: 'n3', text: 'Annealing', children: ['n6'] },
              { id: 'n4', text: 'Extension', children: ['n7'] },
              { id: 'n5', text: '95°C\n30 sec' },
              { id: 'n6', text: 'Primer binding\n30 sec' },
              { id: 'n7', text: '72°C\n1 min/kb' }
            ]
          }
        ]
      },
      {
        id: 'sc3',
        title: 'Sterilization & Microscopy',
        flowCards: [
          {
            id: 'fc5',
            title: 'Aseptic Techniques',
            content: 'Maintaining sterile conditions using autoclaving (121°C, 15psi), ethanol wiping, and flame sterilization. Includes proper bench setup, personal protective equipment (PPE), and waste disposal protocols.',
            image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Sterilization Methods', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Physical', children: ['n4'] },
              { id: 'n3', text: 'Chemical', children: ['n5'] },
              { id: 'n4', text: 'Autoclave\nDry heat' },
              { id: 'n5', text: 'Ethanol\nBleach' }
            ]
          },
          {
            id: 'fc6',
            title: 'Light Microscopy',
            content: 'Brightfield and phase-contrast microscopy for cell observation. Key components: objective lenses (4x-100x), condenser, iris diaphragm. Staining techniques: Gram stain, DAPI for nuclei, FITC for fluorescence.',
            image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Microscope Types', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Brightfield', children: ['n4'] },
              { id: 'n3', text: 'Fluorescence', children: ['n5'] },
              { id: 'n4', text: 'Standard\n40-1000x' },
              { id: 'n5', text: 'Fluorophores\nSpecific labeling' }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which pipette would you use to transfer 150µL of liquid?',
        options: ['P20', 'P200', 'P1000', 'Serological pipette'],
        answer: 'P200'
      },
      {
        id: 'q2',
        question: 'What is the purpose of the annealing step in PCR?',
        options: [
          'To separate DNA strands',
          'For primer binding to template',
          'To synthesize new DNA',
          'To degrade contaminants'
        ],
        answer: 'For primer binding to template'
      },
      {
        id: 'q3',
        question: 'Which sterilization method uses high-pressure steam?',
        options: ['Dry heat', 'Autoclave', 'Ethanol wiping', 'UV radiation'],
        answer: 'Autoclave'
      },
      {
        id: 'q4',
        question: 'What does 100X represent on a microscope objective?',
        options: [
          'Field of view diameter',
          'Total magnification with eyepiece',
          'Working distance in mm',
          'Numerical aperture'
        ],
        answer: 'Total magnification with eyepiece'
      }
    ]
  },
  {
    id: 5,
    title: 'Advanced Genomics',
    icon: Brain,
    description: 'Explore cutting-edge topics in genomics research',
    subchapters: [
      {
        id: 'sc1',
        title: 'Genome Analysis Techniques',
        flowCards: [
          {
            id: 'fc1',
            title: 'Next-Generation Sequencing',
            content: 'High-throughput DNA sequencing technologies (Illumina, PacBio, Oxford Nanopore) enabling whole-genome sequencing. Key metrics: read length (50-300bp short-read, >10kb long-read), coverage depth (30x for humans), and accuracy (>Q30).',
            image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'NGS Platforms', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'Illumina', children: ['n5'] },
              { id: 'n3', text: 'PacBio', children: ['n6'] },
              { id: 'n4', text: 'Nanopore', children: ['n7'] },
              { id: 'n5', text: 'Short-read\nHigh accuracy' },
              { id: 'n6', text: 'Long-read\nHiFi sequencing' },
              { id: 'n7', text: 'Ultra-long reads\nPortable' }
            ]
          },
          {
            id: 'fc2',
            title: 'Comparative Genomics',
            content: 'Analysis of genomic features across species using tools like BLAST and VISTA. Identifies conserved elements (coding/non-coding), evolutionary rates (dN/dS ratios), and lineage-specific adaptations.',
            image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Comparative Methods', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Alignment-Based', children: ['n4'] },
              { id: 'n3', text: 'Alignment-Free', children: ['n5'] },
              { id: 'n4', text: 'BLAST\nMAUVE' },
              { id: 'n5', text: 'k-mer analysis\nPhylogenomics' }
            ]
          }
        ]
      },
      {
        id: 'sc2',
        title: 'Functional & Epigenomics',
        flowCards: [
          {
            id: 'fc3',
            title: 'CRISPR-Cas9 Systems',
            content: 'Precision genome editing using guide RNAs (20bp) and Cas9 nuclease. Applications: gene knockouts (NHEJ repair), precise edits (HDR), activation/repression (dCas9). Delivery methods: lentivirus, electroporation, nanoparticles.',
            image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'CRISPR Components', children: ['n2', 'n3'] },
              { id: 'n2', text: 'gRNA', children: ['n4'] },
              { id: 'n3', text: 'Cas9', children: ['n5'] },
              { id: 'n4', text: '20bp target\nscaffold' },
              { id: 'n5', text: 'Nuclease\nPAM recognition' }
            ]
          },
          {
            id: 'fc4',
            title: 'Epigenetic Modifications',
            content: 'Heritable changes without DNA sequence alteration. Includes DNA methylation (5mC at CpG islands), histone modifications (acetylation/methylation), and chromatin accessibility (ATAC-seq). Regulates gene silencing/X-chromosome inactivation.',
            image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Epigenetic Marks', children: ['n2', 'n3'] },
              { id: 'n2', text: 'DNA Methylation', children: ['n4'] },
              { id: 'n3', text: 'Histone Mods', children: ['n5'] },
              { id: 'n4', text: '5mC\nMeDIP-seq' },
              { id: 'n5', text: 'H3K27ac\nChIP-seq' }
            ]
          }
        ]
      },
      {
        id: 'sc3',
        title: 'Emerging Technologies',
        flowCards: [
          {
            id: 'fc5',
            title: 'Single-Cell Genomics',
            content: 'High-resolution analysis using droplet-based (10X Genomics) or plate-based systems. Techniques: scRNA-seq (gene expression), scATAC-seq (chromatin), and multi-omics. Reveals cell heterogeneity and rare populations.',
            image: 'https://images.unsplash.com/photo-1581092921461-39b2f2f8a4c6?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Single-Cell Methods', children: ['n2', 'n3'] },
              { id: 'n2', text: 'Transcriptomics', children: ['n4'] },
              { id: 'n3', text: 'Epigenomics', children: ['n5'] },
              { id: 'n4', text: 'scRNA-seq\nUMAP clustering' },
              { id: 'n5', text: 'scATAC-seq\nPeak calling' }
            ]
          },
          {
            id: 'fc6',
            title: 'Metagenomics',
            content: 'Shotgun sequencing of microbial communities from environments (gut, soil, ocean). Analysis pipelines: QIIME2 (16S rRNA), MetaPhlAn (species ID), HUMAnN (pathway analysis). Applications: microbiome-drug interactions.',
            image: 'https://images.unsplash.com/photo-1581093057305-25ad2a3e0f2c?auto=format&fit=crop&q=80&w=500',
            flowchart: [
              { id: 'n1', text: 'Metagenomic Steps', children: ['n2', 'n3', 'n4'] },
              { id: 'n2', text: 'Sample Prep', children: ['n5'] },
              { id: 'n3', text: 'Sequencing', children: ['n6'] },
              { id: 'n4', text: 'Bioinformatics', children: ['n7'] },
              { id: 'n5', text: 'DNA extraction\nSize selection' },
              { id: 'n6', text: 'Illumina\nNanopore' },
              { id: 'n7', text: 'Assembly\nBinning' }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which sequencing technology provides the longest read lengths?',
        options: ['Illumina', 'PacBio', 'Ion Torrent', 'Sanger'],
        answer: 'PacBio'
      },
      {
        id: 'q2',
        question: 'What does the "g" in gRNA stand for in CRISPR systems?',
        options: ['Genomic', 'Guiding', 'Guide', 'General'],
        answer: 'Guide'
      },
      {
        id: 'q3',
        question: 'Which technique analyzes chromatin accessibility?',
        options: ['RNA-seq', 'ATAC-seq', 'Whole-genome bisulfite sequencing', 'ChIP-seq'],
        answer: 'ATAC-seq'
      },
      {
        id: 'q4',
        question: 'What does scRNA-seq primarily measure?',
        options: [
          'DNA mutations in single cells',
          'Gene expression in single cells',
          'Protein levels in single cells',
          'Chromatin structure in single cells'
        ],
        answer: 'Gene expression in single cells'
      }
    ]
  }
];

// Enhanced Confetti Celebration
const celebrateCompletion = () => {
  // Left burst
  confetti({
    particleCount: 150,
    angle: 60,
    spread: 70,
    origin: { x: 0, y: 0.7 },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    shapes: ['circle', 'square'],
    scalar: 1.2
  });

  // Right burst
  confetti({
    particleCount: 150,
    angle: 120,
    spread: 70,
    origin: { x: 1, y: 0.7 },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    shapes: ['circle', 'square'],
    scalar: 1.2
  });

  // Center burst after delay
  setTimeout(() => {
    confetti({
      particleCount: 300,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      shapes: ['circle', 'square'],
      scalar: 1.5,
      ticks: 200
    });
  }, 350);

  // Falling confetti for longer duration
  setTimeout(() => {
    const end = Date.now() + 2000;
    const colors = ['#3b82f6', '#10b981', '#f59e0b'];
    
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        scalar: 0.8
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        scalar: 0.8
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, 500);
};

// Interactive Flowchart Component
const Flowchart = ({ nodes }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className="relative">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => hasChildren && toggleNode(node.id)}
          className={`flowchart-node ${hasChildren ? 'cursor-pointer' : ''} ${
            depth === 0 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500' 
              : depth === 1 
                ? 'bg-gradient-to-r from-purple-600 to-purple-500' 
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500'
          } text-white p-4 rounded-xl shadow-lg mb-2 min-w-[220px] transition-all`}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm md:text-base">{node.text}</div>
            {hasChildren && (
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="ml-6 pl-4 border-l-2 border-blue-400/30 mt-2 space-y-2"
          >
            {node.children.map(childId => {
              const childNode = nodes.find(n => n.id === childId);
              return childNode ? renderNode(childNode, depth + 1) : null;
            })}
          </motion.div>
        )}
      </div>
    );
  };

  const rootNodes = nodes.filter(node => !nodes.some(n => n.children && n.children.includes(node.id)));

  return (
    <div className="mt-6 p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm">
      <div className="space-y-3">
        {rootNodes.map(node => renderNode(node))}
      </div>
    </div>
  );
};

// Main Modules Component
const Modules = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedSubchapter, setSelectedSubchapter] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [xp, setXp] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchUserData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setXp(userData.xp || 0);
      setCompletedModules(userData.completedModules || []);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
    setSelectedSubchapter(null);
    setShowQuiz(false);
    setCurrentCardIndex(0);
  };

  const selectSubchapter = (subchapter) => {
    setSelectedSubchapter(subchapter);
    setShowQuiz(false);
    setCurrentCardIndex(0);
  };

  const nextCard = () => {
    if (selectedSubchapter && currentCardIndex < selectedSubchapter.flowCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const startQuiz = (moduleId) => {
    const module = modules.find((m) => m.id === moduleId);
    if (module?.quiz) {
      setCurrentQuiz(module.quiz);
      setShowQuiz(true);
      setSelectedSubchapter(null);
    }
  };

  const handleQuizSubmit = async () => {
    let correctAnswers = 0;
    currentQuiz.forEach((question) => {
      if (quizAnswers[question.id] === question.answer) {
        correctAnswers++;
      }
    });

    if (correctAnswers === currentQuiz.length) {
      const isFirstCompletion = !completedModules.includes(expandedModule);
      
      if (isFirstCompletion) {
        const newXp = xp + 50;
        setXp(newXp);
        celebrateCompletion(); // Enhanced confetti celebration

        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          await updateDoc(userDoc, {
            xp: newXp,
            completedModules: arrayUnion(expandedModule),
          });
        }
      }

      setCompletedModules((prev) => [...new Set([...prev, expandedModule])]);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } else {
      alert('Keep trying! You need all answers correct to complete the module.');
    }
    setShowQuiz(false);
    setQuizAnswers({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Book className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Learning Modules</h1>
          <div className="ml-auto flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/70 px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">{xp} XP</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/70 px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm"
            >
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Level {Math.floor(xp / 100) + 1}</span>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Modules List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/70 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Module List
              </h2>
              <div className="space-y-3">
                {modules.map((module) => (
                  <motion.div
                    key={module.id}
                    initial={false}
                    animate={{ backgroundColor: expandedModule === module.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}
                    className="rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full text-left"
                    >
                      <div className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                        completedModules.includes(module.id)
                          ? 'text-gray-400 hover:bg-gray-700/50'
                          : 'text-white hover:bg-gray-700/50'
                      }`}>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <module.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {module.title}
                            {completedModules.includes(module.id) && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                                Completed
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{module.description}</div>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedModule === module.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedModule === module.id && module.subchapters && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-12 space-y-2 mt-2">
                            {module.subchapters.map((subchapter) => (
                              <motion.button
                                key={subchapter.id}
                                whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                                onClick={() => selectSubchapter(subchapter)}
                                className={`text-sm py-2 px-3 rounded-lg w-full text-left flex items-center gap-2 ${
                                  selectedSubchapter?.id === subchapter.id
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'text-gray-300 hover:bg-gray-700/50'
                                }`}
                              >
                                <ChevronRight className="w-3 h-3" />
                                {subchapter.title}
                              </motion.button>
                            ))}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => startQuiz(module.id)}
                              className="w-full text-sm py-2 px-3 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30 transition-colors flex items-center justify-center gap-2 mt-3"
                            >
                              <Award className="w-4 h-4" />
                              Take Final Quiz
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/70 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-xl"
            >
              {showQuiz ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Final Quiz</h2>
                  </div>
                  <div className="space-y-6">
                    {currentQuiz.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-700/50 p-5 rounded-xl border border-gray-600/30"
                      >
                        <p className="text-white text-lg mb-4 font-medium">{question.question}</p>
                        <div className="space-y-3">
                          {question.options.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-600/50 cursor-pointer transition-colors"
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                onChange={(e) =>
                                  setQuizAnswers({ ...quizAnswers, [question.id]: e.target.value })
                                }
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-gray-200">{option}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleQuizSubmit}
                      className="w-full py-3 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      Submit Quiz
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : selectedSubchapter ? (
                <motion.div
                  key={selectedSubchapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedSubchapter.title}
                    </h2>
                  </div>
                  
                  {selectedSubchapter.flowCards && (
                    <div className="relative">
                      <motion.div
                        key={currentCardIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="bg-gray-700/50 rounded-xl overflow-hidden border border-gray-600/30"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                              <Sparkles className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-2">
                                {selectedSubchapter.flowCards[currentCardIndex].title}
                              </h3>
                              <p className="text-gray-300">
                                {selectedSubchapter.flowCards[currentCardIndex].content}
                              </p>
                            </div>
                          </div>
                          
                          {selectedSubchapter.flowCards[currentCardIndex].flowchart && (
                            <Flowchart nodes={selectedSubchapter.flowCards[currentCardIndex].flowchart} />
                          )}
                        </div>
                      </motion.div>

                      <div className="flex justify-between mt-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={previousCard}
                          disabled={currentCardIndex === 0}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            currentCardIndex === 0
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600/90 text-white hover:bg-blue-700'
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </motion.button>
                        
                        <div className="text-sm text-gray-400">
                          Card {currentCardIndex + 1} of {selectedSubchapter.flowCards.length}
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={nextCard}
                          disabled={currentCardIndex === selectedSubchapter.flowCards.length - 1}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            currentCardIndex === selectedSubchapter.flowCards.length - 1
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600/90 text-white hover:bg-blue-700'
                          }`}
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-block p-6 bg-blue-500/10 rounded-full mb-6">
                    <Dna className="w-12 h-12 text-blue-400" />
                  </div>
                  <h2 className="text-xl text-gray-300 font-medium">
                    Select a chapter to start learning
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Explore our interactive modules on gene visualization
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Success Modal with Confetti */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onAnimationComplete={() => {
              if (!completedModules.includes(expandedModule)) {
                celebrateCompletion(); // Extra celebration when modal appears
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gray-800/90 p-8 rounded-xl shadow-2xl text-center border border-gray-700/50 backdrop-blur-sm max-w-md w-full mx-4"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {completedModules.includes(expandedModule) 
                  ? 'Great Job Again!' 
                  : 'Module Completed!'}
              </motion.h2>
              {!completedModules.includes(expandedModule) && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-blue-400 text-lg"
                >
                  +50 XP Earned!
                </motion.p>
              )}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 mt-2"
              >
                {completedModules.includes(expandedModule) 
                  ? 'You can review the material anytime' 
                  : "You've unlocked new knowledge!"}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 px-6 py-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Learning
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Modules;
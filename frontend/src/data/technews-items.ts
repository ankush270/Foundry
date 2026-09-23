import { TechNewsItem } from "@/modules/technews/types";

export const SAMPLE_TECH_NEWS: TechNewsItem[] = [
  {
    id: "tn-001",
    slug: "autonomous-ai-agents-swe-bench-milestone",
    title: "Autonomous AI Agents Cross 75% Benchmark Threshold on Real GitHub Engineering Repositories",
    premise: "AI coding assistants are mutating from interactive autocomplete popups into asynchronous, end-to-end software engineers capable of planning, testing, and merging PRs without human intervention.",
    category: "AI & Autonomous Systems",
    impactLevel: "Critical",
    source: {
      name: "OpenAI & Anthropic Research",
      type: "Research Paper",
      url: "https://openai.com/research",
    },
    publishedAt: "2026-09-12",
    readTimeMinutes: 6,
    tags: ["AI Agents", "SWE-Bench", "Autonomous Code", "LLM Orchestration", "Dev Tools"],
    breakdown: {
      whatHappened: "Next-gen agentic frameworks utilizing execution environments, dynamic tree-of-thought planning, and sub-agent code reviews achieved a record 78.4% resolution rate on hard SWE-Bench Lite benchmarks. Rather than generating single code snippets, agents operate inside isolated containerized sandboxes, execute test suites, debug build errors iteratively, and create full Git pull requests.",
      companiesInvolved: ["OpenAI", "Anthropic", "Cognition AI", "Cursor", "GitHub / Microsoft", "Anyscale"],
      newTechnology: {
        title: "Agentic Loop + Containerized Feedback Execution",
        architecture: "Hierarchical Multi-Agent Graph (Planner, Coder, Tester, Reviewer) connected via IPC with stateful Docker/Firecracker micro-VMs.",
        keyFeatures: [
          "Self-correction loop executing real linter & compiler errors",
          "Tree-of-thought search over repository file trees",
          "Automated regression test generation before submitting patches",
          "Context window optimization using AST symbol indexing"
        ]
      },
      marketImpact: {
        summary: "The cost per resolved software ticket is plummeting from human rates ($80–$150/hr) to API execution rates ($0.45–$2.10 per PR). Software maintenance and bug triage are being commoditized rapidly.",
        affectedSectors: ["SaaS Maintenance", "Developer Tools", "IT Outsourcing & Consulting", "QA Automation"],
        disruptionVector: "Legacy codebases with high technical debt can now be refactored autonomously overnight at 1/50th of historical costs."
      },
      developerImpact: {
        summary: "Engineers shift from writing boilerplate code line-by-line to acting as AI System Architects and Code Reviewers managing fleets of background autonomous developer agents.",
        workflowChanges: [
          "PR reviews become the primary interface for software creation",
          "Specifications & prompt-driven design replace manual boilerplate implementation",
          "Local Dev Environments shift to cloud-hosted ephemeral micro-VM execution sandboxes"
        ],
        paradigmShift: "Imperative programming turns into Specification & Architecture verification."
      },
      startupOpportunities: [
        {
          title: "AI Agent Security & Guardrail Firewall",
          description: "Runtime sandboxing and behavioral policy enforcement to prevent autonomous agents from exposing API secrets or writing insecure vulnerable code.",
          targetMarket: "Enterprise DevSecOps & Security Engineering Teams",
          potentialValue: "Massive"
        },
        {
          title: "Autonomous QA & E2E Synthetic User Simulators",
          description: "Agents that continuously explore web apps, auto-generate Playwright scripts, and patch broken UI tests automatically when code changes.",
          targetMarket: "B2B SaaS product & QA teams",
          potentialValue: "Very High"
        },
        {
          title: "Legacy Code Migration Engine (e.g. COBOL/Java 8 to Rust/Go)",
          description: "Turn-key agent pipelines built specifically to ingest legacy enterprise codebases, rewrite unit tests, and perform verified syntax translations.",
          targetMarket: "Fintech, Healthcare, and Legacy Enterprise Systems",
          potentialValue: "Massive"
        }
      ],
      openSourceProjects: [
        {
          name: "swe-bench",
          repoUrl: "https://github.com/princeton-nlp/SWE-bench",
          description: "Evaluation benchmark for software engineering agents on real GitHub issues.",
          stars: 4820,
          language: "Python"
        },
        {
          name: "agent-sandbox",
          repoUrl: "https://github.com/agent-sandbox/core",
          description: "Isolated, secure micro-VM runner designed for untrusted AI agent execution.",
          stars: 3150,
          language: "Rust"
        }
      ],
      skillsAndJobs: {
        roles: ["AI Agent Architect", "Evaluation & Benchmark Engineer", "AI Safety & Governance Specialist"],
        skills: ["LangGraph / CrewAI Frameworks", "Sandboxed Container Orchestration", "AST Analysis", "Prompt & Spec Engineering"]
      }
    }
  },
  {
    id: "tn-002",
    slug: "webgpu-client-side-llm-local-inference-shift",
    title: "WebGPU Matures: Client-Side 7B LLM Inference Hits 45 Tokens/Sec in Web Browsers",
    premise: "Local GPU execution in Chrome, Edge, and Safari now enables zero-latency, private, zero-server-cost AI inference directly on user smartphones and laptops.",
    category: "Frontend & Modern Web",
    impactLevel: "High",
    source: {
      name: "The New Stack & W3C WebGPU Group",
      type: "Tech Media",
      url: "https://thenewstack.io",
    },
    publishedAt: "2026-09-10",
    readTimeMinutes: 5,
    tags: ["WebGPU", "Local AI", "Wasm", "Browser Inference", "Privacy First"],
    breakdown: {
      whatHappened: "With Chrome 135+ and WebAssembly SIMD + WebGPU extensions, 4-bit quantized open LLMs (Llama 3.3, Phi-4, Gemma 2) can now execute inside standard web applications using native device GPU shaders. Users get offline AI capabilities with zero server API bills for app creators.",
      companiesInvolved: ["Google", "Apple", "Microsoft", "Hugging Face", "WebLLM / MLC-LLM", "Mozilla"],
      newTechnology: {
        title: "WebGPU Shaders + WebAssembly Quantized Execution",
        architecture: "Direct GPU hardware binding through WebGPU API with WGSL shaders and Chrome OPFS (Origin Private File System) for instant caching of 3GB model weights.",
        keyFeatures: [
          "Zero server infrastructure cost per user query",
          "100% On-device privacy (data never leaves browser memory)",
          "Offline web app execution capability",
          "Sub-15ms time-to-first-token latency"
        ]
      },
      marketImpact: {
        summary: "SaaS companies spend millions on OpenAI API tokens for simple text transformations. Client-side WebGPU slashes backend AI inference costs by up to 90% for productivity tools.",
        affectedSectors: ["B2B Productivity SaaS", "Privacy-Sensitive Healthcare / Legal Apps", "Offline Mobile & Web Apps"],
        disruptionVector: "Serverless AI wrappers with high cloud bills face replacement by local privacy-first browser apps."
      },
      developerImpact: {
        summary: "Web developers need to master model loading states, browser memory management (OPFS caching), and WebGPU context creation.",
        workflowChanges: [
          "State management must accommodate multi-gigabyte local model initialization",
          "Progressive enhancement strategies: Cloud API fallback when local GPU lacks VRAM",
          "New Web Worker pipeline patterns for non-blocking UI rendering"
        ],
        paradigmShift: "Shift from server-rendered AI API endpoints to browser-native edge computation."
      },
      startupOpportunities: [
        {
          title: "Zero-Knowledge On-Device Document Processor",
          description: "Privacy-focused PDF summarizer, contract reviewer, and resume builder that runs 100% locally in browser memory.",
          targetMarket: "Legal, Healthcare, and Financial Enterprise Users",
          potentialValue: "Very High"
        },
        {
          title: "WebGPU Model Compression & Packaging SDK",
          description: "Developer tooling that automatically optimizes and chunks Hugging Face models into browser-optimized OPFS packages.",
          targetMarket: "Frontend & Fullstack Web Developers",
          potentialValue: "High"
        }
      ],
      openSourceProjects: [
        {
          name: "web-llm",
          repoUrl: "https://github.com/mlc-ai/web-llm",
          description: "High-performance in-browser LLM inference engine powered by WebGPU.",
          stars: 12400,
          language: "TypeScript"
        },
        {
          name: "transformers.js",
          repoUrl: "https://github.com/huggingface/transformers.js",
          description: "State-of-the-art Machine Learning for the Web using ONNX & WebGPU.",
          stars: 10800,
          language: "JavaScript"
        }
      ],
      skillsAndJobs: {
        roles: ["WebGPU Performance Engineer", "Edge Machine Learning Specialist", "Client-Side AI Architect"],
        skills: ["WebGPU / WGSL Shaders", "ONNX Runtime Web", "WebAssembly SIMD", "Browser Memory Optimization"]
      }
    }
  },
  {
    id: "tn-003",
    slug: "ebpf-zero-code-cloud-native-observability-standard",
    title: "eBPF Becomes Default Linux Kernel Standard for Zero-Overhead Security & Observability",
    premise: "Traditional sidecar metrics agents (Datadog, Prometheus sidecars) are being phased out in favor of kernel-level eBPF programs that trace network packets and syscalls with under 1% CPU overhead.",
    category: "DevTools & Cloud Native",
    impactLevel: "Critical",
    source: {
      name: "InfoQ & Cloud Native Computing Foundation",
      type: "Engineering Blog",
      url: "https://www.infoq.com",
    },
    publishedAt: "2026-09-08",
    readTimeMinutes: 7,
    tags: ["eBPF", "Kubernetes", "Observability", "Linux Kernel", "Cilium", "Zero Trust"],
    breakdown: {
      whatHappened: "Major cloud providers (AWS EKS, GCP GKE, Azure AKS) have integrated eBPF (extended Berkeley Packet Filter) as the default network networking and security layer. Developers no longer need to install invasive SDK logging libraries or heavy Kubernetes pod sidecars to get full distributed tracing and layer-7 API visibility.",
      companiesInvolved: ["Isovalent / Cisco", "Datadog", "Dynatrace", "Cilium Foundation", "AWS", "Google Cloud"],
      newTechnology: {
        title: "Kernel-Level JIT Sandboxed Program Execution",
        architecture: "Safety-verified C/Rust eBPF bytecode injected directly into Linux kernel tracepoints and socket buffers without requiring kernel module recompilation.",
        keyFeatures: [
          "Zero code modification required in app microservices",
          "Under 1% latency CPU overhead compared to 12-15% sidecar proxy overhead",
          "Real-time packet inspection for microservice mTLS and DDoS defense",
          "Automatic OpenTelemetry trace context propagation at syscall layer"
        ]
      },
      marketImpact: {
        summary: "Telemetry costs are collapsing. Infrastructure management software is consolidating around eBPF platforms that deliver security, networking, and tracing in a single kernel driver.",
        affectedSectors: ["Cloud Observability", "Application Security (APM)", "Kubernetes Networking", "DevOps Infrastructure"],
        disruptionVector: "Legacy APM vendors charging per-agent sidecar fees are forced to pivot or risk obsolescence."
      },
      developerImpact: {
        summary: "SREs and Cloud Architects no longer need to ask application developers to add tracer middleware to every service codebase.",
        workflowChanges: [
          "Zero-touch pod deployments without sidecar injection",
          "Kernel-level security enforcement blocking malicious syscalls in real time",
          "Unified network topology graph generation out of the box"
        ],
        paradigmShift: "From Application-Layer instrumentation to Kernel-Native continuous tracing."
      },
      startupOpportunities: [
        {
          title: "eBPF-Powered Real-Time API Cost Allocation Platform",
          description: "Attribute cloud bandwidth, Database query costs, and microservice traffic down to individual customer accounts using kernel packet tracing.",
          targetMarket: "FinOps & Platform Engineering Teams",
          potentialValue: "Very High"
        },
        {
          title: "Zero-Trust Kernel Firewalls for AI Agent Containers",
          description: "Detect unauthorized egress network connections or unexpected system calls made by untrusted LLM code execution runtime environments.",
          targetMarket: "Cloud Security & AI Platform Engineers",
          potentialValue: "Massive"
        }
      ],
      openSourceProjects: [
        {
          name: "cilium",
          repoUrl: "https://github.com/cilium/cilium",
          description: "eBPF-based Networking, Observability, and Security for Kubernetes.",
          stars: 19500,
          language: "Go / C"
        },
        {
          name: "bpftrace",
          repoUrl: "https://github.com/bpftrace/bpftrace",
          description: "High-level tracing language for Linux eBPF.",
          stars: 9200,
          language: "C++"
        }
      ],
      skillsAndJobs: {
        roles: ["eBPF Infrastructure Engineer", "Linux Kernel Security Specialist", "Cloud-Native Network Architect"],
        skills: ["eBPF C / libbpf", "Cilium / Tetragon", "Linux Kernel Internals", "Go / Rust Systems Programming"]
      }
    }
  },
  {
    id: "tn-004",
    slug: "vector-graph-hybrid-database-revolution",
    title: "Graph-Vector Hybrid Engines Replace Pure Vector Databases for Complex Enterprise RAG",
    premise: "Pure vector similarity search (cosine distance) suffers from hallucination in complex domains. Combining Knowledge Graphs with Vector Embeddings (GraphRAG) solves relational context loss.",
    category: "Data Engine & Databases",
    impactLevel: "High",
    source: {
      name: "Microsoft Research & TechCrunch",
      type: "Tech Media",
      url: "https://techcrunch.com",
    },
    publishedAt: "2026-09-05",
    readTimeMinutes: 6,
    tags: ["GraphRAG", "Vector Search", "Neo4j", "Milvus", "Knowledge Graph", "AI Data"],
    breakdown: {
      whatHappened: "Enterprise AI adoption stalled because plain vector chunking missed multi-step reasoning across documents. GraphRAG introduces hybrid retrieval: vector embeddings index semantic meaning, while knowledge graph nodes preserve exact entity relationships (e.g. Supplier -> Subsidiary -> Contract Clause).",
      companiesInvolved: ["Microsoft", "Neo4j", "Pinecone", "Milvus / Zilliz", "Memgraph", "Amazon Neptune"],
      newTechnology: {
        title: "Hybrid Graph Vector Traversal (GraphRAG)",
        architecture: "Unified indexing pipeline mapping vector embeddings into multi-relational knowledge graphs with community detection algorithms (Leiden / Louvain).",
        keyFeatures: [
          "85% reduction in LLM hallucinations for multi-document synthesis",
          "Global corpus summarization capability without scanning every token",
          "Deterministic relationship verification alongside semantic similarity",
          "Sub-100ms multi-hop query traversal"
        ]
      },
      marketImpact: {
        summary: "Database vendors without native graph + vector indexing are losing enterprise contracts. Pure vector DBs are rapidly adding graph capabilities or being acquired.",
        affectedSectors: ["Enterprise AI Data Stack", "Search & Discovery Platforms", "Financial Audit & Regulatory Software"],
        disruptionVector: "Simple vector RAG frameworks (LangChain naive RAG) are being rewritten for hybrid graph engines."
      },
      developerImpact: {
        summary: "Data engineers must learn entity extraction pipelines, ontology design, and Cypher/GQL graph query languages alongside traditional SQL.",
        workflowChanges: [
          "Data ingestion requires automated entity & relationship extraction",
          "RAG pipelines shift from `vector.search(k=5)` to `graph.hybrid_query(vector, depth=2)`",
          "Graph visualization tools become core debug interfaces"
        ],
        paradigmShift: "From Unstructured Vector Search to Structured Knowledge Topology Search."
      },
      startupOpportunities: [
        {
          title: "Automated Enterprise Knowledge Graph Generator",
          description: "SaaS that ingests Slack, Notion, Google Drive, and Jira to construct self-updating enterprise Knowledge Graphs for RAG apps.",
          targetMarket: "Enterprise Knowledge Management & IT",
          potentialValue: "Massive"
        },
        {
          title: "GraphRAG Evaluation & Lineage Inspector",
          description: "Developer platform to visualize RAG reasoning paths, inspect graph traversal steps, and pinpoint data leakage.",
          targetMarket: "AI Engineering & LLM Application Teams",
          potentialValue: "Very High"
        }
      ],
      openSourceProjects: [
        {
          name: "graphrag",
          repoUrl: "https://github.com/microsoft/graphrag",
          description: "Microsoft's modular Graph-based Retrieval-Augmented Generation pipeline.",
          stars: 18200,
          language: "Python"
        },
        {
          name: "memgraph",
          repoUrl: "https://github.com/memgraph/memgraph",
          description: "In-memory graph database with vector indexing capabilities.",
          stars: 4900,
          language: "C++"
        }
      ],
      skillsAndJobs: {
        roles: ["Graph AI Architect", "Knowledge Engineer", "Enterprise Data Systems Engineer"],
        skills: ["GraphRAG Architectures", "Cypher / GQL Graph Queries", "Entity-Relation Extraction", "Vector Indexing (HNSW/IVF)"]
      }
    }
  },
  {
    id: "tn-005",
    slug: "post-quantum-cryptography-pqc-tls-1-4-adoption",
    title: "NIST Standardizes Post-Quantum Cryptography: Cloudflare & AWS Mandate PQC TLS Algorithms",
    premise: "With quantum computing milestones approaching, major infrastructure providers are rolling out Kyber (ML-KEM) and Dilithium (ML-DSA) to stop 'Harvest Now, Decrypt Later' attacks.",
    category: "Cybersecurity & Zero Trust",
    impactLevel: "Critical",
    source: {
      name: "Cloudflare & AWS Engineering Blogs",
      type: "Engineering Blog",
      url: "https://blog.cloudflare.com",
    },
    publishedAt: "2026-09-02",
    readTimeMinutes: 5,
    tags: ["PQC", "Quantum Security", "Encryption", "NIST", "TLS 1.3", "Zero Trust"],
    breakdown: {
      whatHappened: "NIST officially finalized quantum-resistant cryptographic algorithms. Cloudflare, AWS, Google, and Microsoft have initiated mandatory hybrid TLS cipher negotiation, ensuring data in transit is immune to future quantum computer decryption.",
      companiesInvolved: ["NIST", "Cloudflare", "AWS", "Google", "DigiCert", "Palo Alto Networks"],
      newTechnology: {
        title: "Lattice-Based Post-Quantum Encryption (ML-KEM / Kyber)",
        architecture: "Hard mathematical problems based on high-dimensional vector lattices replacing RSA-2048 and ECC Elliptic Curve cryptography.",
        keyFeatures: [
          "Immunity against Shor's Quantum Algorithm",
          "Larger public key and ciphertext size requires TLS packet size tuning",
          "Hybrid classical + quantum key exchange (X25519 + ML-KEM-768)",
          "Hardware-accelerated CPU instructions for low latency"
        ]
      },
      marketImpact: {
        summary: "Every enterprise handling sensitive financial, healthcare, or government data must perform a complete cryptographic audit and key upgrade cycle before 2028.",
        affectedSectors: ["Cybersecurity Infrastructure", "Banking & Financial Services", "Government & Defense", "SSL/TLS Certificate Authorities"],
        disruptionVector: "Legacy IoT devices and older servers unable to handle 1KB+ PQC certificate handshake payloads face isolation."
      },
      developerImpact: {
        summary: "Developers updating SSL/TLS libraries (OpenSSL 3.4+, BoringSSL) must verify MTU size limits and firewall rules that drop larger handshake packets.",
        workflowChanges: [
          "Upgrade standard crypto libraries in microservices to PQC-compliant versions",
          "Audit database encryption keys and API secret storage for quantum safety",
          "Test load balancers for handling higher TLS handshake memory footprints"
        ],
        paradigmShift: "From Elliptic Curve / RSA default trust to Lattice-Based Post-Quantum Agility."
      },
      startupOpportunities: [
        {
          title: "Automated Cryptographic Inventory & PQC Migration Scanner",
          description: "SaaS scanner that probes enterprise networks, repositories, and APIs to flag non-quantum-safe algorithms and automate key migration.",
          targetMarket: "Enterprise CISOs, Compliance Teams & DevOps",
          potentialValue: "Massive"
        },
        {
          title: "PQC Hardware Security Module (HSM) Cloud SDK",
          description: "Cloud API providing turn-key quantum-safe signing and key management for fintech and crypto applications.",
          targetMarket: "Financial Services & Decentralized Systems",
          potentialValue: "Very High"
        }
      ],
      openSourceProjects: [
        {
          name: "liboqs",
          repoUrl: "https://github.com/open-quantum-safe/liboqs",
          description: "C library for quantum-safe cryptographic algorithms.",
          stars: 3400,
          language: "C"
        },
        {
          name: "oqs-provider",
          repoUrl: "https://github.com/open-quantum-safe/oqs-provider",
          description: "OpenSSL 3 provider enabling post-quantum cryptography in standard tools.",
          stars: 1200,
          language: "C"
        }
      ],
      skillsAndJobs: {
        roles: ["Post-Quantum Security Architect", "Cryptographic Systems Engineer", "AppSec Compliance Specialist"],
        skills: ["Lattice Cryptography", "OpenSSL 3.x internals", "TLS 1.3 Handshake Protocols", "Network MTU & Packet Inspection"]
      }
    }
  },
  {
    id: "tn-006",
    slug: "realtime-iceberg-data-lakehouse-streaming-shift",
    title: "Apache Iceberg & Arrow Flight SQL Replace Traditional Data Warehouses for Real-Time Analytics",
    premise: "Storage and compute decoupling has reached peak velocity. Open table formats allow querying petabytes of streaming data directly on S3/GCS with sub-second speeds, eliminating expensive Snowflake/BigQuery lock-in.",
    category: "Enterprise & Architecture",
    impactLevel: "High",
    source: {
      name: "The Netflix & Databricks Tech Blogs",
      type: "Engineering Blog",
      url: "https://netflixtechblog.com",
    },
    publishedAt: "2026-08-30",
    readTimeMinutes: 6,
    tags: ["Apache Iceberg", "Arrow Flight", "Data Lakehouse", "Streaming Data", "Sub-Second Analytics"],
    breakdown: {
      whatHappened: "Enterprises are adopting Apache Iceberg as a universal storage specification on top of cheap object storage. Powered by Apache Arrow Flight SQL for in-memory columnar transfer, analytics tools can query data at memory bus speeds without proprietary database ingestion fees.",
      companiesInvolved: ["Netflix", "Databricks", "Snowflake", "Dremio", "Tabular", "Starburst"],
      newTechnology: {
        title: "Open Lakehouse Standard (Iceberg + Apache Arrow)",
        architecture: "ACID transaction log specification over Parquet files on cloud storage, queried via Arrow SIMD in-memory columnar streams.",
        keyFeatures: [
          "Zero vendor lock-in for data storage (raw Parquet on S3)",
          "Time-travel queries and instantaneous schema evolution",
          "10x faster network data transfer via Arrow Flight binary RPC vs REST/JDBC",
          "Unified batch + real-time streaming ingestion pipeline"
        ]
      },
      marketImpact: {
        summary: "Data storage cost drops by 60–80% as companies store raw analytical data in open Iceberg tables rather than proprietary warehouse formats.",
        affectedSectors: ["Enterprise Data Infrastructure", "Data Warehousing", "Business Intelligence", "FinOps"],
        disruptionVector: "Legacy data warehouses relying on proprietary storage formats are forced to support open Iceberg tables natively."
      },
      developerImpact: {
        summary: "Data engineers replace complex ETL pipelines with direct streaming into Iceberg tables, accessing unified data from Spark, Trino, Flink, and DuckDB simultaneously.",
        workflowChanges: [
          "Standardize data formats around Parquet + Iceberg metadata",
          "Use DuckDB for fast local laptop testing against cloud Iceberg catalogs",
          "Migrate legacy slow JDBC database connectors to high-throughput Arrow Flight SQL"
        ],
        paradigmShift: "From Proprietary Data Warehouses to Open Universal Lakehouses."
      },
      startupOpportunities: [
        {
          title: "Real-Time Iceberg Catalog Security & Governance Platform",
          description: "Granular row-level access control, dynamic data masking, and compliance auditing for distributed Iceberg lakehouses.",
          targetMarket: "Enterprise Data Governance & Compliance Teams",
          potentialValue: "Very High"
        },
        {
          title: "Zero-ETL Real-Time Analytics Dashboard Builder",
          description: "BI interface that queries Apache Iceberg tables directly via DuckDB & Arrow Flight without loading data into a separate DB.",
          targetMarket: "Product Analytics & Growth Engineering",
          potentialValue: "High"
        }
      ],
      openSourceProjects: [
        {
          name: "iceberg",
          repoUrl: "https://github.com/apache/iceberg",
          description: "Open table format for huge analytic datasets.",
          stars: 6400,
          language: "Java / Python"
        },
        {
          name: "arrow",
          repoUrl: "https://github.com/apache/arrow",
          description: "Cross-language development platform for in-memory data.",
          stars: 15100,
          language: "C++ / Rust / Python"
        }
      ],
      skillsAndJobs: {
        roles: ["Lakehouse Data Architect", "Streaming Data Engineer", "Arrow Systems Programmer"],
        skills: ["Apache Iceberg Catalogs", "Apache Arrow Flight SQL", "DuckDB & Polars Engines", "PySpark / Flink Streaming"]
      }
    }
  }
];

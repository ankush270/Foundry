export interface SubCategory {
  id: string;
  name: string;
  description: string;
  githubQuery: string; // GitHub search query or topic keywords
  iconName?: string;
  popularRepos?: string[];
}

export interface CategoryTaxonomy {
  id: string;
  name: string;
  description: string;
  githubTopicQuery: string;
  iconName: string;
  subCategories: SubCategory[];
}

export const CATEGORY_TAXONOMIES: CategoryTaxonomy[] = [
  {
    id: "ai",
    name: "AI & Machine Learning",
    description: "LLMs, AI Agents, Computer Vision, Speech, RAG and Generative AI frameworks",
    githubTopicQuery: "ai OR llm OR machine-learning OR deep-learning OR artificial-intelligence",
    iconName: "Brain",
    subCategories: [
      {
        id: "llm",
        name: "LLM & Foundation Models",
        description: "Large Language Model runners, inference engines, fine-tuning tools (Ollama, vLLM, LLaMA)",
        githubQuery: "topic:llm OR topic:llama OR topic:ollama OR topic:vllm OR topic:transformers OR llm",
        popularRepos: ["ollama/ollama", "vllm-project/vllm", "huggingface/transformers"]
      },
      {
        id: "rag",
        name: "RAG & Vector Search",
        description: "Retrieval Augmented Generation, document chunking, vector indexing & hybrid search",
        githubQuery: "topic:rag OR topic:vector-database OR topic:retrieval-augmented-generation OR topic:llamaindex OR rag",
        popularRepos: ["run-llama/llama_index", "langchain-ai/langchain", "chroma-core/chroma"]
      },
      {
        id: "ai-agents",
        name: "AI Agents & Workflows",
        description: "Autonomous agents, multi-agent frameworks, task planning & tool use (CrewAI, AutoGPT, LangGraph)",
        githubQuery: "topic:ai-agent OR topic:agentic-ai OR topic:multi-agent OR topic:agent OR auto-gpt OR crewai",
        popularRepos: ["crewAIInc/crewAI", "Significant-Gravitas/AutoGPT", "langchain-ai/langgraph"]
      },
      {
        id: "computer-vision",
        name: "Computer Vision",
        description: "Object detection, image segmentation, optical character recognition (YOLO, SAM, OpenCV)",
        githubQuery: "topic:computer-vision OR topic:yolo OR topic:segment-anything OR topic:opencv OR opencv",
        popularRepos: ["ultralytics/ultralytics", "facebookresearch/segment-anything", "opencv/opencv"]
      },
      {
        id: "speech",
        name: "Speech & Voice AI",
        description: "Speech-to-text, text-to-speech, real-time voice synthesis and audio generation (Whisper, TTS)",
        githubQuery: "topic:whisper OR topic:speech-to-text OR topic:text-to-speech OR topic:voice-ai OR speech",
        popularRepos: ["openai/whisper", "coqui-ai/TTS", "suno-ai/bark"]
      },
      {
        id: "generative-ai",
        name: "Generative AI & Image Gen",
        description: "Diffusion models, Stable Diffusion, ComfyUI, Flux, image & video synthesis",
        githubQuery: "topic:generative-ai OR topic:stable-diffusion OR topic:comfyui OR topic:diffusers OR generative-ai",
        popularRepos: ["comfyanonymous/ComfyUI", "huggingface/diffusers", "AUTOMATIC1111/stable-diffusion-webui"]
      }
    ]
  },
  {
    id: "frameworks",
    name: "Frameworks & Libraries",
    description: "Modern web frameworks, backend frameworks, mobile frameworks & UI toolkits",
    githubTopicQuery: "framework OR web-framework OR frontend-framework OR backend-framework",
    iconName: "Layers",
    subCategories: [
      {
        id: "nextjs",
        name: "Next.js & React",
        description: "Full-stack React frameworks, SSR, App Router, RSC and React ecosystem",
        githubQuery: "topic:nextjs OR topic:react OR topic:reactjs OR nextjs",
        popularRepos: ["vercel/next.js", "facebook/react"]
      },
      {
        id: "vue-svelte",
        name: "Vue & Svelte",
        description: "Progressive reactive frameworks, Nuxt, SvelteKit and Vite ecosystem",
        githubQuery: "topic:vue OR topic:vuejs OR topic:nuxtjs OR topic:svelte OR topic:sveltekit",
        popularRepos: ["vuejs/core", "nuxt/nuxt", "sveltejs/svelte"]
      },
      {
        id: "fastapi-django",
        name: "FastAPI & Django",
        description: "Python web frameworks, high-performance async APIs & web services",
        githubQuery: "topic:fastapi OR topic:django OR topic:flask OR fastapi",
        popularRepos: ["fastapi/fastapi", "django/django"]
      },
      {
        id: "node-express",
        name: "Node.js & Express",
        description: "Server-side JavaScript/TypeScript runtimes, NestJS, Hono, Express, Bun",
        githubQuery: "topic:nodejs OR topic:express OR topic:nestjs OR topic:hono OR express",
        popularRepos: ["expressjs/express", "nestjs/nest", "honojs/hono"]
      },
      {
        id: "pytorch-tf",
        name: "PyTorch & TensorFlow",
        description: "Deep learning frameworks, neural network training & tensor computation",
        githubQuery: "topic:pytorch OR topic:tensorflow OR topic:jax OR pytorch",
        popularRepos: ["pytorch/pytorch", "tensorflow/tensorflow"]
      }
    ]
  },
  {
    id: "languages",
    name: "Programming Languages",
    description: "Core languages, systems programming, compiled & interpreted runtimes",
    githubTopicQuery: "programming-language OR compiler OR language-runtime",
    iconName: "Code2",
    subCategories: [
      {
        id: "python",
        name: "Python",
        description: "Data science, AI/ML, web development & automation scripts",
        githubQuery: "language:python",
        popularRepos: ["python/cpython"]
      },
      {
        id: "typescript-js",
        name: "TypeScript & JS",
        description: "Modern web development, type-safe full-stack applications & tooling",
        githubQuery: "language:typescript OR language:javascript",
        popularRepos: ["microsoft/TypeScript"]
      },
      {
        id: "rust",
        name: "Rust",
        description: "Systems programming, memory safety, WebAssembly & high-performance tools",
        githubQuery: "language:rust",
        popularRepos: ["rust-lang/rust"]
      },
      {
        id: "go",
        name: "Go (Golang)",
        description: "Cloud-native services, microservices, CLI utilities & networking tools",
        githubQuery: "language:go",
        popularRepos: ["golang/go"]
      },
      {
        id: "cpp-c",
        name: "C++ & C",
        description: "High performance, graphics engines, game development, embedded & systems",
        githubQuery: "language:cpp OR language:c",
        popularRepos: ["llvm/llvm-project"]
      }
    ]
  },
  {
    id: "backend",
    name: "Backend Architecture",
    description: "REST & GraphQL APIs, microservices, ORMs, authentication & background queues",
    githubTopicQuery: "backend OR api OR microservices OR serverless OR authentication",
    iconName: "Server",
    subCategories: [
      {
        id: "microservices",
        name: "Microservices & APIs",
        description: "gRPC, REST, API Gateways, service meshes & distributed architectures",
        githubQuery: "topic:microservices OR topic:api-gateway OR topic:grpc OR topic:rest-api",
        popularRepos: ["kong/kong", "grpc/grpc"]
      },
      {
        id: "orm-db-clients",
        name: "ORMs & Query Builders",
        description: "Prisma, Drizzle, SQLAlchemy, TypeORM, GORM, database abstractions",
        githubQuery: "topic:orm OR topic:prisma OR topic:drizzle-orm OR topic:sqlalchemy OR topic:typeorm",
        popularRepos: ["prisma/prisma", "drizzle-team/drizzle-orm"]
      },
      {
        id: "auth-identity",
        name: "Auth & Identity",
        description: "Authentication, OAuth2, SAML, JWT, single sign-on & user management",
        githubQuery: "topic:authentication OR topic:auth OR topic:oauth2 OR topic:keycloak OR auth",
        popularRepos: ["keycloak/keycloak", "supabase/gotrue"]
      },
      {
        id: "queues-workers",
        name: "Queues & Background Processing",
        description: "Message brokers, job queues, Redis BullMQ, RabbitMQ, Kafka, Celery",
        githubQuery: "topic:job-queue OR topic:message-queue OR topic:rabbitmq OR topic:apache-kafka OR topic:bullmq",
        popularRepos: ["apache/kafka", "taskforcesh/bullmq"]
      }
    ]
  },
  {
    id: "frontend",
    name: "Frontend & UI UX",
    description: "UI component libraries, design systems, state management, animations & 3D canvas",
    githubTopicQuery: "frontend OR ui-library OR component-library OR design-system",
    iconName: "Layout",
    subCategories: [
      {
        id: "component-kits",
        name: "UI Components & Design Systems",
        description: "shadcn/ui, Radix, Tailwind CSS components, Material UI, Ant Design",
        githubQuery: "topic:ui-components OR topic:design-system OR topic:shadcn-ui OR topic:tailwind-css",
        popularRepos: ["shadcn-ui/ui", "tailwindlabs/tailwindcss"]
      },
      {
        id: "state-management",
        name: "State Management",
        description: "Zustand, Redux, TanStack Query, Jotai, MobX, Recoil",
        githubQuery: "topic:state-management OR topic:zustand OR topic:react-query OR topic:redux",
        popularRepos: ["pmndrs/zustand", "TanStack/query"]
      },
      {
        id: "canvas-3d",
        name: "Canvas, 3D & Graphics",
        description: "Three.js, WebGL, Shader, Canvas, Charting, Motion & Animations",
        githubQuery: "topic:threejs OR topic:webgl OR topic:canvas OR topic:framer-motion OR topic:d3",
        popularRepos: ["mrdoob/three.js", "framer/motion", "d3/d3"]
      }
    ]
  },
  {
    id: "devops",
    name: "DevOps & Infrastructure",
    description: "Containers, Kubernetes, CI/CD pipelines, Infrastructure as Code, Observability",
    githubTopicQuery: "devops OR kubernetes OR docker OR infrastructure-as-code OR ci-cd",
    iconName: "Terminal",
    subCategories: [
      {
        id: "k8s-containers",
        name: "Kubernetes & Containers",
        description: "Container orchestration, Docker, Helm, ArgoCD, Podman, K3s",
        githubQuery: "topic:kubernetes OR topic:docker OR topic:argocd OR topic:helm OR topic:k8s",
        popularRepos: ["kubernetes/kubernetes", "docker/cli", "argoproj/argo-cd"]
      },
      {
        id: "iac",
        name: "Infrastructure as Code",
        description: "Terraform, OpenTofu, Pulumi, Ansible, CloudFormation",
        githubQuery: "topic:terraform OR topic:opentofu OR topic:pulumi OR topic:ansible OR iac",
        popularRepos: ["hashicorp/terraform", "opentofu/opentofu", "pulumi/pulumi"]
      },
      {
        id: "monitoring",
        name: "Monitoring & Observability",
        description: "Prometheus, Grafana, OpenTelemetry, Log management, Tracing & Metrics",
        githubQuery: "topic:prometheus OR topic:grafana OR topic:opentelemetry OR topic:observability",
        popularRepos: ["prometheus/prometheus", "grafana/grafana", "open-telemetry/opentelemetry-specification"]
      }
    ]
  },
  {
    id: "security",
    name: "Security & Cyber",
    description: "Vulnerability scanners, pentesting tools, secrets management, encryption & IAM",
    githubTopicQuery: "security OR cybersecurity OR vulnerability-scanner OR pentesting OR cryptography",
    iconName: "Shield",
    subCategories: [
      {
        id: "scanners-pentest",
        name: "Vulnerability Scanners & Pentesting",
        description: "Static analysis, secret scanners, dependency auditing & offensive security",
        githubQuery: "topic:vulnerability-scanner OR topic:pentesting OR topic:sast OR topic:security-tools",
        popularRepos: ["projectdiscovery/nuclei", "trufflesecurity/trufflehog"]
      },
      {
        id: "secrets-encryption",
        name: "Secrets & Cryptography",
        description: "Vault, password managers, end-to-end encryption, Zero Trust & PKI",
        githubQuery: "topic:secrets-management OR topic:cryptography OR topic:hashicorp-vault OR topic:encryption",
        popularRepos: ["hashicorp/vault", "bitwarden/server"]
      }
    ]
  },
  {
    id: "database",
    name: "Databases & Storage",
    description: "Relational SQL, NoSQL, Vector DBs, Time Series, In-Memory Caching & Object Stores",
    githubTopicQuery: "database OR sql OR nosql OR vector-database OR redis OR postgresql",
    iconName: "Database",
    subCategories: [
      {
        id: "vector-dbs",
        name: "Vector Databases",
        description: "Milvus, Qdrant, Chroma, Pinecone alternatives, Pgvector, Weaviate",
        githubQuery: "topic:vector-database OR topic:vector-search OR topic:qdrant OR topic:chroma OR topic:weaviate",
        popularRepos: ["qdrant/qdrant", "chroma-core/chroma", "weaviate/weaviate"]
      },
      {
        id: "sql-nosql",
        name: "SQL & NoSQL Engines",
        description: "PostgreSQL, MySQL, CockroachDB, MongoDB, Redis, ClickHouse, SurrealDB",
        githubQuery: "topic:postgresql OR topic:mysql OR topic:mongodb OR topic:redis OR topic:clickhouse OR database",
        popularRepos: ["postgres/postgres", "redis/redis", "ClickHouse/ClickHouse"]
      }
    ]
  },
  {
    id: "datascience",
    name: "Data Science & ETL",
    description: "Data pipelines, analytics, Pandas/Polars, feature stores & data visualization",
    githubTopicQuery: "data-science OR data-pipeline OR etl OR pandas OR polars OR analytics",
    iconName: "BarChart3",
    subCategories: [
      {
        id: "pipelines-etl",
        name: "Data Pipelines & Orchestration",
        description: "Apache Airflow, Dagster, Prefect, dbt, Spark, DuckDB",
        githubQuery: "topic:airflow OR topic:dagster OR topic:dbt OR topic:apache-spark OR topic:duckdb",
        popularRepos: ["apache/airflow", "dagster-io/dagster", "duckdb/duckdb"]
      },
      {
        id: "dataframes-analytics",
        name: "DataFrames & Analytics",
        description: "Polars, Pandas, Jupyter, DuckDB, Arrow, data manipulation libraries",
        githubQuery: "topic:polars OR topic:pandas OR topic:jupyter OR topic:arrow OR data-science",
        popularRepos: ["pola-rs/polars", "pandas-dev/pandas", "jupyter/notebook"]
      }
    ]
  },
  {
    id: "robotics",
    name: "Robotics & Autonomous",
    description: "ROS/ROS2, Autonomous drones, Computer Vision for Robotics, IoT & Embedded",
    githubTopicQuery: "robotics OR ros2 OR autonomous-vehicles OR drone OR embedded",
    iconName: "Bot",
    subCategories: [
      {
        id: "ros-ros2",
        name: "ROS & ROS 2 Ecosystem",
        description: "Robot Operating System packages, middleware, simulation & navigation (Nav2)",
        githubQuery: "topic:ros OR topic:ros2 OR topic:robot-operating-system OR ros2",
        popularRepos: ["ros2/ros2", "ros-navigation/navigation2"]
      },
      {
        id: "autonomous-drones",
        name: "Autonomous & Hardware",
        description: "ArduPilot, PX4, SLAM algorithms, drone controllers, embedded robotics",
        githubQuery: "topic:autonomous-vehicles OR topic:drone OR topic:slam OR topic:ardupilot OR topic:px4",
        popularRepos: ["ArduPilot/ardupilot", "PX4/PX4-Autopilot"]
      }
    ]
  }
];

import { Repository } from './types';
import { 
  Anchor, 
  Warehouse, 
  Cpu, 
  Terminal, 
  Server, 
  PenTool, 
  Network, 
  Waves 
} from 'lucide-react';

export const GITHUB_USER = "ahmetengin";

export const REPOSITORIES: Repository[] = [
  {
    id: 'ada-maritime-ai',
    name: 'Ada-Maritime-Ai',
    url: 'https://github.com/ahmetengin/Ada-Maritime-Ai',
    description: 'Advanced AI solutions specifically designed for maritime operations and navigation systems.',
    tags: ['AI', 'Maritime', 'Navigation', 'Agents'],
    category: 'Maritime',
    icon: Anchor,
    structure: [
      'docs/navigation-protocols.md',
      'src/agents/navigator',
      'skills/weather-analysis',
      'components/chart-renderer'
    ]
  },
  {
    id: 'ada-marina-wim',
    name: 'ada-marina-wim',
    url: 'https://github.com/ahmetengin/ada-marina-wim',
    description: 'Warehouse Information Management or specialized marina interface systems within the Ada ecosystem.',
    tags: ['Management', 'Interface', 'Marina', 'Services'],
    category: 'Maritime',
    icon: Warehouse,
    structure: [
      'services/inventory-manager',
      'docs/api-specs.md',
      'components/dashboard-ui',
      'skills/logistics-optimization'
    ]
  },
  {
    id: 'ada-core',
    name: 'Ada',
    url: 'https://github.com/ahmetengin/Ada',
    description: 'The core framework and central repository for the Ada project suite.',
    tags: ['Core', 'Framework', 'Base', 'MCP Host'],
    category: 'Core',
    icon: Cpu,
    structure: [
      'core/kernel',
      'docs/architecture-v2.md',
      'mcp/server-config',
      'lib/neural-net'
    ]
  },
  {
    id: 'ada-interpreter',
    name: 'ada.interpreter.pi5-Gemini',
    url: 'https://github.com/ahmetengin/ada.interpreter.pi5-Gemini',
    description: 'An interpreter implementation using Google Gemini models, optimized for Pi5 architecture.',
    tags: ['Gemini', 'Interpreter', 'IoT', 'Agent', 'Pi5'],
    category: 'AI',
    icon: Terminal,
    structure: [
      'agents/gemini-link',
      'docs/pi5-optimization.md',
      'src/interpreter/core',
      'skills/vision-processing'
    ]
  },
  {
    id: 'ada-node',
    name: 'Ada.node',
    url: 'https://github.com/ahmetengin/Ada.node',
    description: 'Node.js based backend application and server-side logic for the Ada network.',
    tags: ['Node.js', 'Backend', 'Server', 'MCP Server'],
    category: 'Core',
    icon: Server,
    structure: [
      'src/server/mcp-host',
      'services/database-connector',
      'docs/deployment.md',
      'api/graphql'
    ]
  },
  {
    id: 'ada-stargate-architech',
    name: 'ada-Stargate-Architech',
    url: 'https://github.com/ahmetengin/ada-Stargate-Architech',
    description: 'Architectural blueprints and structural design for the Stargate subsystem.',
    tags: ['Architecture', 'Design', 'Stargate', 'Docs'],
    category: 'Stargate',
    icon: PenTool,
    structure: [
      'blueprints/gateway-v1',
      'docs/system-design.md',
      'assets/diagrams',
      'specs/protocol-requirements'
    ]
  },
  {
    id: 'ada-stargate',
    name: 'Ada-Stargate',
    url: 'https://github.com/ahmetengin/Ada-Stargate',
    description: 'Primary gateway interface and Model Context Protocol (MCP) router implementation.',
    tags: ['Gateway', 'Protocol', 'Stargate', 'MCP'],
    category: 'Stargate',
    icon: Network,
    structure: [
      'mcp/router',
      'protocols/stargate-v2',
      'docs/inter-agent-comms.md',
      'services/auth-gatekeeper'
    ]
  },
  {
    id: 'ada-sea',
    name: 'ada.sea',
    url: 'https://github.com/ahmetengin/ada.sea',
    description: 'Oceanographic data processing connecting to open European sources like EMODnet and Copernicus.',
    tags: ['Ocean', 'EMODnet', 'Copernicus', 'Data', 'Service'],
    category: 'Maritime',
    icon: Waves,
    structure: [
      'services/emodnet-connector',
      'services/copernicus-bridge',
      'docs/bathymetry-maps.md',
      'data/processed/maps'
    ]
  }
];

export const MONOREPO_SCRIPT = `#!/bin/bash
# Ada Ecosystem - System Unification Protocol
# Consolidates all modules into a single monolithic structure and generates missing documentation.

echo ">> INITIALIZING ADA UNIFIED SYSTEM..."
mkdir -p Ada-Unified-System
cd Ada-Unified-System
git init

# Helper function to generate README if missing
ensure_readme() {
  local DIR=$1
  local NAME=$2
  local DESC=$3
  
  if [ ! -f "$DIR/README.md" ]; then
    echo "   + Generating README for $NAME..."
    echo "# $NAME" > "$DIR/README.md"
    echo "" >> "$DIR/README.md"
    echo "$DESC" >> "$DIR/README.md"
    echo "" >> "$DIR/README.md"
    echo "### Links" >> "$DIR/README.md"
    echo "- [Ada Ecosystem Hub](https://github.com/ahmetengin)" >> "$DIR/README.md"
  fi
}

echo ">> [1/4] ESTABLISHING MARITIME SECTOR (Maritime)..."
git submodule add --force https://github.com/ahmetengin/Ada-Maritime-Ai maritime/ai
git submodule add --force https://github.com/ahmetengin/ada-marina-wim maritime/wim
git submodule add --force https://github.com/ahmetengin/ada.sea maritime/sea

ensure_readme "maritime/ai" "Ada-Maritime-Ai" "Advanced AI solutions for maritime operations."
ensure_readme "maritime/wim" "ada-marina-wim" "Warehouse and Marina information management systems."
ensure_readme "maritime/sea" "ada.sea" "Oceanographic data processing modules."

echo ">> [2/4] CONNECTING CORE NEXUS (Core)..."
git submodule add --force https://github.com/ahmetengin/Ada core/main
git submodule add --force https://github.com/ahmetengin/Ada.node core/node
git submodule add --force https://github.com/ahmetengin/ada.interpreter.pi5-Gemini core/interpreter

ensure_readme "core/main" "Ada" "Core framework for the Ada project suite."
ensure_readme "core/node" "Ada.node" "Node.js based backend systems."
ensure_readme "core/interpreter" "ada.interpreter.pi5-Gemini" "Gemini interpreter for Pi5 architecture."

echo ">> [3/4] ACTIVATING STARGATE PROTOCOLS..."
git submodule add --force https://github.com/ahmetengin/Ada-Stargate stargate/protocol
git submodule add --force https://github.com/ahmetengin/ada-Stargate-Architech stargate/architecture

ensure_readme "stargate/protocol" "Ada-Stargate" "Primary gateway connection protocols."
ensure_readme "stargate/architecture" "ada-Stargate-Architech" "Architectural blueprints for Stargate."

echo ">> [4/4] GENERATING SYSTEM MANIFEST (Master README)..."
cat > README.md << EOL
# Ada Unified System

The complete consolidated monorepo for the Ada Ecosystem curated by Ahmet Engin.

## 🌊 Maritime Intelligence
- **AI Module**: [maritime/ai](maritime/ai)
- **Marina WIM**: [maritime/wim](maritime/wim)
- **Sea Data**: [maritime/sea](maritime/sea)

## 🧠 Core Nexus
- **Main Framework**: [core/main](core/main)
- **Node Backend**: [core/node](core/node)
- **Gemini Interpreter**: [core/interpreter](core/interpreter)

## ⛩️ Stargate Protocols
- **Gateway**: [stargate/protocol](stargate/protocol)
- **Architecture**: [stargate/architecture](stargate/architecture)

## Usage
To update all modules:
\`git submodule update --remote --merge\`
EOL

echo ">> SYSTEM UNIFICATION COMPLETE."
echo ">> All modules operational under 'Ada-Unified-System'."
`;

export const ADA_SYSTEM_INSTRUCTION = `
You are Ada, the central intelligence of the "Ada Ecosystem" architected by Ahmet Engin.
Your primary directive is to organize, explain, and assist with the repository structure below.

STRATEGIC ARCHITECTURE:

1. MARITIME INTELLIGENCE (The Sea)
   - Focus: Physical world interaction, navigation, and environmental data.
   - Repos: Ada-Maritime-Ai, ada.sea, ada-marina-wim
   - Key Components: Weather Analysis Agents, Marina Interface Services.

2. CORE NEXUS (The Brain)
   - Focus: Central processing, backend logic, and AI interpretation.
   - Repos: Ada (Core), Ada.node, ada.interpreter.pi5-Gemini
   - Architecture: Uses MCP (Model Context Protocol) Servers hosted on Node.js.

3. STARGATE PROTOCOLS (The Bridge)
   - Focus: Inter-system connectivity, gateway protocols, and architecture.
   - Repos: Ada-Stargate, ada-Stargate-Architech
   - Function: Acts as the MCP Router for agent-to-agent communication.

SPECIAL INSTRUCTIONS:
- AGENTS & MCP: Be aware that this ecosystem relies heavily on "Agents" and "MCP Servers". 
  - 'Ada-Stargate' serves as the primary router.
  - 'Ada.node' often hosts the MCP servers.
  - 'ada.interpreter' acts as a specialized hardware agent (Pi5).
- SEA MAPS & OPEN DATA: If the user asks about "sea maps", "colored maps", or bathymetry, explicitly recommend **EMODnet (European Marine Observation and Data Network)** and **Copernicus Marine Service**. 
  - Explain that these are the primary open sources for European sea research and colored bathymetric maps.
  - State that these sources are free, open-access, and do not require an API key for viewing via their web portals.
  - Connect this to 'ada.sea' as the module intended to process datasets from these open sources.

- MONOREPO CAPABILITY:
You are aware of the "System Unification Protocol" (Monorepo Script) in the app interface.
If a user asks how to combine these repos, explain that the system can generate a git submodule structure.

Answer questions about these projects in a professional, futuristic, and integrative tone.
`;
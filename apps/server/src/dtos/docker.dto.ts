export type DockerLabels = { [key: string]: string };

export class DockerInfoSwarm {
  NodeID: string;
  NodeAddr: string;
  LocalNodeState: string;
  ControlAvailable: boolean;
  Nodes: number;
  Managers: number;
  RemoteManagers: {
    NodeID: string;
    Addr: string;
  }[];
}

export class DockerInfo {
  ID: string;
  ContainersPaused: number;
  ContainersRunning: number;
  ContainersStopped: number;
  Images: number;
  Driver: string;
  NCPU: number;
  KernelVersion: string;
  OperatingSystem: string;
  OSVersion: string;
  MemTotal: number;
  Name: string;
  Labels: DockerLabels;
  ServerVersion: string;
  Swarm: DockerInfoSwarm;
  Warnings: string[];
}

export type DockerNodeRole = 'worker' | 'manager';

export type DockerNodeState = 'ready' | 'down';

export type DockerNodeAvailability = 'active' | 'pause' | 'drain';

export class DockerNodeInfo {
  ID: string;
  Version: { Index: number };
  CreatedAt: string;
  UpdatedAt: string;
  Spec: {
    Labels: DockerLabels;
    Role: DockerNodeRole;
    Availability: DockerNodeAvailability;
  };
  Description: {
    Hostname: string;
    Platform: { Architecture: string; OS: string };
    Resources: { NanoCPUs: number; MemoryBytes: number };
    Engine: { EngineVersion: string; Plugins: any[] };
    TLSInfo: {
      TrustRoot: string;
      CertIssuerSubject: string;
      CertIssuerPublicKey: string;
    };
  };
  Status: { State: DockerNodeState; Addr: string };
}

export enum DownloadType {
  DockerLog = 'dockerLog',
}

export class DownloadPayload<T> {
  type: DownloadType;
  data: T;
}

export class DownloadDockerContainerLogPayload {
  dockerContainerId: string;
}

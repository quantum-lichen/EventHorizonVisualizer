export interface SimulationParams {
  radius: number;
  resolution: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
export type DataTransform = (data: any) => any;

export const combineTransforms = (...transforms: Array<DataTransform>): DataTransform =>
  (data: any) => transforms.reduce((acc, transform) => transform(acc), data);

export const timestampToDate = (timestamp: string | number): string => {
  const date = new Date(parseInt(`${timestamp}`, 10) * 1000);

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

export const hoursFrom24To12 = (hours: number): { ampm: string; h: number; } => {
  const ampm = hours >= 12 ? 'pm' : 'am';
  const h = hours % 12;

  return {
    ampm,
    h: h || 12,
  };
};

export const timestampToDateTime = (timestamp: string | number): string => {
  const date = new Date(parseInt(`${timestamp}`, 10) * 1000);
  const { h, ampm } = hoursFrom24To12(date.getHours());

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${h}:${date.getMinutes()}${ampm}`;
};

export const cleanBlank = (data: any) => typeof data === 'undefined' || data === null ? '' : data;

export const formatPercentage = (data: number) => `${parseFloat(`${data}`).toFixed(2)}%`;

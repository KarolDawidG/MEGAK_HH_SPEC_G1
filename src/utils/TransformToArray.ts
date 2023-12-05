export const TransformToArray = ({ value }: { value: string }) => {
  return String(value)
    .split(',')
    .map((el) => Number(el));
};

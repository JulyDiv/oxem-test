export const formatNumber = (str: string | number): string => str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const deleteSpace = (str: string | number): number => Number(str.toString().replaceAll(' ', ''));

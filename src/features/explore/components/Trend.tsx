import { TRENDING_TAB } from '../constants/tabs';
import { Trend as TrendType } from '../types/api';

function formatNumber(count: number): string {
  if (count > Math.pow(10, 4)) {
    return `${(count / Math.pow(10, 4)).toFixed(1)}K`;
  }
  if (count > Math.pow(10, 6)) {
    return `${(count / Math.pow(10, 6)).toFixed(1)}M`;
  } else return count.toLocaleString();
}
export default function Trend({
  data,
  indx,
  category,
  onClick,
}: {
  data: TrendType;
  indx: number;
  category: string;
  onClick: () => void;
}) {
  return (
    <div
      className="px-4 py-3 w-full flex flex-1 flex-col hover:bg-input-bg-hover/40 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="text-[13px] text-text-inactive">
        <span>{indx}</span>
        <span>{category !== TRENDING_TAB && ` · ${category}`} · Trending</span>
      </div>
      <div className="font-bold text-[15px] text-text-active mt-0.5">
        <span dir="auto">{data.tag}</span>
      </div>
      <div className="text-[13px] text-text-inactive mt-0.5">
        <span>{formatNumber(data.totalPosts)} posts</span>
      </div>
    </div>
  );
}

import React from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { HiColorSwatch } from 'react-icons/hi';
import type { IconType } from 'react-icons';
import { usePortfolioStore } from '../../store/store';


type SidebarSectionProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsible?: boolean;
  containerRef?: React.Ref<HTMLDivElement>;
  icon?: IconType;
};

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  action,
  children,
  open = true,
  onOpenChange,
  collapsible = true,
  containerRef,
  icon,
}) => {
  const isOpen = open;
  const toggle = () => {
    if (!collapsible) return;
    onOpenChange?.(!isOpen);
  };

  const { getCurrentLayout } = usePortfolioStore();
  const layout = getCurrentLayout?.();
  const accent = layout?.settings?.accentColor || '#0ea5e9';

  return (
    <div ref={containerRef} className=" bg-white rounded-sm md:rounded-md border border-gray-200">
      <div className="p-0.5 md:p-1 lg:p-2  flex items-center justify-between bg-gray-200">

        <h3 className="text-sm lg:text-base font-bold  text-gray-800 flex items-center gap-2">
          <span className="inline md:hidden">
            {React.createElement((icon || HiColorSwatch) as any, { size: 18, color: accent })}
          </span>
          <span className="hidden md:inline">{title}</span>
        </h3>
        <div className="flex items-center gap-2">
          {action}
          {collapsible && (
            <button
              onClick={toggle}
              title="Toggle section"
              aria-label="Toggle section"
              className="w-4 md:w-6 h-4 md:h-6 flex items-center justify-center text-sky-600"
            >
              {isOpen ? (
                React.createElement(FaCaretUp as any, { size: 18, color: accent })
              ) : (
                React.createElement(FaCaretDown as any, { size: 18, color: accent })
              )}
            </button>
          )}
        </div>
      </div>
      {isOpen && <div className="my-1 md:my-2 p-1 md:p-1.5 lg:p-2.5">{children}</div>}
    </div>
  );
};

export default SidebarSection;

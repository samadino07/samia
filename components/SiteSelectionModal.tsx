import React from 'react';
import { Button } from './Button';
import { SiteOption } from '../types';
import { SITE_OPTIONS } from '../constants';

interface SiteSelectionModalProps {
  isOpen: boolean;
  onSelect: (site: string) => void;
  onCancel: () => void;
}

export const SiteSelectionModal: React.FC<SiteSelectionModalProps> = ({ isOpen, onSelect, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Sélectionnez le site</h3>
        <div className="space-y-3">
          {SITE_OPTIONS.map((site) => (
            <Button
              key={site}
              variant="secondary"
              onClick={() => onSelect(site)}
              className="text-sm py-3"
            >
              {site}
            </Button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
           <button 
             onClick={onCancel}
             className="w-full text-center text-sm text-gray-500 hover:text-gray-700 underline"
           >
             Annuler
           </button>
        </div>
      </div>
    </div>
  );
};
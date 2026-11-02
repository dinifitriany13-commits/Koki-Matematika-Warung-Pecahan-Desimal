import React from 'react';

interface Props {
  avatarKey: string;
  size?: number;
  className?: string;
  mood?: 'normal' | 'happy' | 'disappointed';
}

export const CustomerAvatar: React.FC<Props> = ({
  avatarKey,
  size = 64,
  className = '',
  mood = 'normal'
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 overflow-hidden shadow-xs shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {avatarKey === 'budi' && (
          // Budi - Indonesian primary school boy with red/white tie
          <g>
            <circle cx="50" cy="50" r="46" fill="#FEF3C7" />
            {/* Hair */}
            <path d="M26 40 C26 22, 74 22, 74 40 C74 46, 70 34, 50 32 C30 34, 26 46, 26 40 Z" fill="#292524" />
            <path d="M26 36 C34 18, 66 18, 74 36 C64 28, 36 28, 26 36 Z" fill="#1C1917" />
            {/* Face */}
            <ellipse cx="50" cy="52" rx="22" ry="24" fill="#FDE68A" />
            {/* Ears */}
            <circle cx="28" cy="52" r="5" fill="#FCD34D" />
            <circle cx="72" cy="52" r="5" fill="#FCD34D" />
            {/* Eyes */}
            <circle cx="42" cy="50" r="3" fill="#1E293B" />
            <circle cx="58" cy="50" r="3" fill="#1E293B" />
            <circle cx="43" cy="49" r="1" fill="#FFFFFF" />
            <circle cx="59" cy="49" r="1" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="38" cy="56" r="3" fill="#F87171" opacity="0.4" />
            <circle cx="62" cy="56" r="3" fill="#F87171" opacity="0.4" />
            {/* Mouth based on mood */}
            {mood === 'happy' && (
              <path d="M42 58 Q50 68 58 58" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="#DC2626" />
            )}
            {mood === 'disappointed' && (
              <path d="M43 62 Q50 56 57 62" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            )}
            {mood === 'normal' && (
              <path d="M44 58 Q50 64 56 58" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            )}
            {/* Shirt & Red tie (Seragam Merah Putih SD) */}
            <path d="M22 88 L34 72 L66 72 L78 88 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <polygon points="50,72 45,86 50,96 55,86" fill="#DC2626" />
          </g>
        )}

        {avatarKey === 'siti' && (
          // Siti - Girl with soft cyan/mint hijab
          <g>
            <circle cx="50" cy="50" r="46" fill="#ECFDF5" />
            {/* Hijab background */}
            <path d="M22 45 C22 20, 78 20, 78 45 C78 78, 68 88, 50 88 C32 88, 22 78, 22 45 Z" fill="#0D9488" />
            {/* Face opening */}
            <ellipse cx="50" cy="48" rx="16" ry="19" fill="#FDE68A" />
            {/* Inner hijab cap */}
            <path d="M35 38 C42 34, 58 34, 65 38 C60 36, 40 36, 35 38 Z" fill="#14B8A6" />
            {/* Eyes */}
            <circle cx="44" cy="48" r="2.8" fill="#1E293B" />
            <circle cx="56" cy="48" r="2.8" fill="#1E293B" />
            <circle cx="45" cy="47" r="0.9" fill="#FFFFFF" />
            <circle cx="57" cy="47" r="0.9" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="40" cy="53" r="2.5" fill="#F472B6" opacity="0.5" />
            <circle cx="60" cy="53" r="2.5" fill="#F472B6" opacity="0.5" />
            {/* Mouth */}
            {mood === 'happy' ? (
              <path d="M44 54 Q50 62 56 54" stroke="#B45309" strokeWidth="2.2" strokeLinecap="round" fill="#DC2626" />
            ) : mood === 'disappointed' ? (
              <path d="M45 58 Q50 53 55 58" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M45 54 Q50 59 55 54" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none" />
            )}
            {/* Hijab folds & flower pin */}
            <circle cx="34" cy="62" r="4" fill="#FBBF24" />
          </g>
        )}

        {avatarKey === 'pak_joko' && (
          // Pak Joko - Friendly male teacher with glasses & batik shirt
          <g>
            <circle cx="50" cy="50" r="46" fill="#FEF3C7" />
            {/* Hair */}
            <path d="M26 38 C28 20, 72 20, 74 38 C74 42, 68 30, 50 30 C32 30, 26 42, 26 38 Z" fill="#1F2937" />
            {/* Face */}
            <ellipse cx="50" cy="50" rx="20" ry="22" fill="#FDE68A" />
            {/* Ears */}
            <circle cx="30" cy="50" r="4.5" fill="#FCD34D" />
            <circle cx="70" cy="50" r="4.5" fill="#FCD34D" />
            {/* Glasses */}
            <rect x="36" y="44" width="11" height="8" rx="2" fill="none" stroke="#374151" strokeWidth="1.8" />
            <rect x="53" y="44" width="11" height="8" rx="2" fill="none" stroke="#374151" strokeWidth="1.8" />
            <line x1="47" y1="48" x2="53" y2="48" stroke="#374151" strokeWidth="1.8" />
            {/* Eyes behind glasses */}
            <circle cx="41.5" cy="48" r="2" fill="#1F2937" />
            <circle cx="58.5" cy="48" r="2" fill="#1F2937" />
            {/* Mustache */}
            <path d="M44 57 Q50 55 56 57" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
            {/* Mouth */}
            {mood === 'happy' ? (
              <path d="M44 61 Q50 68 56 61" stroke="#92400E" strokeWidth="2.2" strokeLinecap="round" fill="#DC2626" />
            ) : mood === 'disappointed' ? (
              <path d="M45 64 Q50 60 55 64" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M46 61 Q50 64 54 61" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none" />
            )}
            {/* Brown Batik Pattern Shirt */}
            <path d="M22 86 L36 70 L64 70 L78 86 Z" fill="#92400E" />
            <circle cx="45" cy="78" r="2" fill="#FDE68A" />
            <circle cx="55" cy="78" r="2" fill="#FDE68A" />
          </g>
        )}

        {avatarKey === 'bu_rt' && (
          // Bu RT - Warm motherly figure with hair bun
          <g>
            <circle cx="50" cy="50" r="46" fill="#FFFBEB" />
            {/* Bun */}
            <circle cx="50" cy="22" r="10" fill="#374151" />
            {/* Hair */}
            <path d="M26 44 C26 26, 74 26, 74 44 C74 48, 68 34, 50 34 C32 34, 26 48, 26 44 Z" fill="#374151" />
            {/* Face */}
            <ellipse cx="50" cy="52" rx="21" ry="23" fill="#FDE68A" />
            {/* Earrings */}
            <circle cx="28" cy="56" r="3" fill="#F59E0B" />
            <circle cx="72" cy="56" r="3" fill="#F59E0B" />
            {/* Eyes */}
            <circle cx="42" cy="49" r="2.5" fill="#1F2937" />
            <circle cx="58" cy="49" r="2.5" fill="#1F2937" />
            {/* Eyebrows */}
            <path d="M38 45 Q42 43 46 45" stroke="#374151" strokeWidth="1.5" fill="none" />
            <path d="M54 45 Q58 43 62 45" stroke="#374151" strokeWidth="1.5" fill="none" />
            {/* Cheeks */}
            <circle cx="37" cy="56" r="3.5" fill="#FB7185" opacity="0.4" />
            <circle cx="63" cy="56" r="3.5" fill="#FB7185" opacity="0.4" />
            {/* Mouth */}
            {mood === 'happy' ? (
              <path d="M43 59 Q50 67 57 59" stroke="#991B1B" strokeWidth="2.4" strokeLinecap="round" fill="#DC2626" />
            ) : mood === 'disappointed' ? (
              <path d="M44 63 Q50 58 56 63" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M45 59 Q50 64 55 59" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" fill="none" />
            )}
            {/* Kebaya Outfit */}
            <path d="M22 88 L34 72 L66 72 L78 88 Z" fill="#BE185D" />
            <path d="M46 72 L50 88 L54 72 Z" fill="#FDE68A" />
          </g>
        )}

        {avatarKey === 'mochi_cat' && (
          // Mochi - Cute Warung Cat with miniature chef hat!
          <g>
            <circle cx="50" cy="50" r="46" fill="#FEF3C7" />
            {/* Cat Ears */}
            <polygon points="26,38 34,18 46,32" fill="#F59E0B" />
            <polygon points="30,36 35,22 42,32" fill="#FBCFE8" />
            <polygon points="74,38 66,18 54,32" fill="#F59E0B" />
            <polygon points="70,36 65,22 58,32" fill="#FBCFE8" />
            {/* Cat Head */}
            <ellipse cx="50" cy="54" rx="26" ry="24" fill="#FBBF24" />
            <ellipse cx="50" cy="58" rx="18" ry="16" fill="#FFFBEB" />
            {/* Chef Mini Hat */}
            <ellipse cx="50" cy="30" rx="12" ry="5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <path d="M42 30 C38 18, 62 18, 58 30 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            {/* Eyes */}
            <ellipse cx="40" cy="52" rx="3.5" ry="4.5" fill="#1F2937" />
            <ellipse cx="60" cy="52" rx="3.5" ry="4.5" fill="#1F2937" />
            <circle cx="41.5" cy="50.5" r="1.3" fill="#FFFFFF" />
            <circle cx="61.5" cy="50.5" r="1.3" fill="#FFFFFF" />
            {/* Nose & Whiskers */}
            <polygon points="50,57 48,55 52,55" fill="#EC4899" />
            <line x1="28" y1="56" x2="42" y2="57" stroke="#78350F" strokeWidth="1.2" />
            <line x1="26" y1="61" x2="42" y2="60" stroke="#78350F" strokeWidth="1.2" />
            <line x1="58" y1="57" x2="72" y2="56" stroke="#78350F" strokeWidth="1.2" />
            <line x1="58" y1="60" x2="74" y2="61" stroke="#78350F" strokeWidth="1.2" />
            {/* Mouth */}
            <path d="M46 59 Q50 63 54 59" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Bell collar */}
            <rect x="36" y="74" width="28" height="6" rx="3" fill="#DC2626" />
            <circle cx="50" cy="80" r="4.5" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
          </g>
        )}

        {avatarKey === 'rina' && (
          // Rina - Scout girl (Pramuka) with brown beret
          <g>
            <circle cx="50" cy="50" r="46" fill="#FEF3C7" />
            {/* Scout Beret */}
            <path d="M22 36 C24 16, 76 16, 78 36 C70 42, 30 42, 22 36 Z" fill="#78350F" />
            <circle cx="70" cy="30" r="4" fill="#F59E0B" />
            {/* Hair */}
            <path d="M28 44 C28 32, 72 32, 72 44 C72 58, 68 40, 50 38 C32 40, 28 58, 28 44 Z" fill="#1C1917" />
            {/* Face */}
            <ellipse cx="50" cy="52" rx="20" ry="22" fill="#FDE68A" />
            {/* Eyes */}
            <circle cx="43" cy="50" r="2.8" fill="#1F2937" />
            <circle cx="57" cy="50" r="2.8" fill="#1F2937" />
            <circle cx="44" cy="49" r="0.9" fill="#FFFFFF" />
            <circle cx="58" cy="49" r="0.9" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="39" cy="56" r="3" fill="#F472B6" opacity="0.4" />
            <circle cx="61" cy="56" r="3" fill="#F472B6" opacity="0.4" />
            {/* Mouth */}
            {mood === 'happy' ? (
              <path d="M43 58 Q50 66 57 58" stroke="#B45309" strokeWidth="2.2" strokeLinecap="round" fill="#DC2626" />
            ) : mood === 'disappointed' ? (
              <path d="M44 62 Q50 57 56 62" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M44 58 Q50 63 56 58" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none" />
            )}
            {/* Scout Uniform (Cokelat Pramuka) */}
            <path d="M22 88 L34 72 L66 72 L78 88 Z" fill="#92400E" />
            {/* Hasduk / Scarf (Merah Putih) */}
            <polygon points="50,72 45,86 50,94 55,86" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
};

import React from 'react'

interface PokemonSearchIconProps {
  className?: string
  width?: number
  height?: number
}

export function PokemonSearchIcon({ 
  className = '', 
  width = 20, 
  height = 20 
}: PokemonSearchIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      focusable="false"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        d="M8.5 2C9.23468 2 9.94707 2.09504 10.627 2.27051C10.4625 2.51236 10.2543 2.76721 10.0107 3.01074C9.6708 3.35066 9.31048 3.62439 8.99121 3.80176C8.81924 3.89728 8.69222 3.94698 8.61035 3.97266L8.5 4C4.91015 4 2 6.91015 2 10.5C2 14.0899 4.91015 17 8.5 17C12.0899 17 15 14.0899 15 10.5L15.0273 10.3896C15.053 10.3078 15.1027 10.1807 15.1982 10.0088C15.3756 9.68952 15.6493 9.32922 15.9893 8.98926C16.2324 8.74615 16.4861 8.53736 16.7275 8.37305C16.9033 9.05301 17 9.76513 17 10.5C17 12.3052 16.4372 13.979 15.4775 15.3555L20.0605 19.9395L17.9395 22.0605L13.3564 17.4775C11.9799 18.4374 10.3055 19 8.5 19C3.80558 19 0 15.1944 0 10.5C0 5.80558 3.80558 2 8.5 2Z"
        fill="currentColor"
      />
      <path
        d="M13 1.5C13 3.3 15.7 6 17.5 6C15.7 6 13 8.7 13 10.5C13 8.7 10.3 6 8.5 6C10.3 6 13 3.30046 13 1.5Z"
        fill="currentColor"
      />
      <path
        d="M19 0C19 1.2 20.8 3 22 3C20.8 3 19 4.8 19 6C19 4.8 17.2 3 16 3C17.2 3 19 1.2 19 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

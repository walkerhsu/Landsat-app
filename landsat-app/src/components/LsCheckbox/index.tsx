import React from 'react'
import { LsColor } from '@/constants/ls-color'

interface Props {
  checked: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}

export function LsCheckbox({ checked, disabled = false, onChange }: Props) {
  const handleClick: React.MouseEventHandler<HTMLDivElement> = React.useCallback((e) => {
    if (disabled || !onChange)
      return

    e.stopPropagation()
    onChange(!checked)
  }, [onChange, disabled, checked])

  let containerBgColor = LsColor.DarkBlue
  let borderColor = LsColor.DarkBlue

  if (checked) {
    containerBgColor = disabled ? LsColor.SteelBlue : LsColor.DarkBlue
    borderColor = disabled ? LsColor.SteelBlue : LsColor.DarkBlue
  }
  else {
    containerBgColor = disabled ? LsColor.Grey100 : LsColor.White
    borderColor = disabled ? LsColor.Grey300 : LsColor.DarkBlue
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} onClick={handleClick}>
      <span
        style={{
          width: 24,
          height: 24,
          backgroundColor: containerBgColor,
          border: `1px solid ${borderColor}`,
          display: 'inline-block',
          borderRadius: '4px',
          position: 'relative',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span
          style={{
            content: '""',
            position: 'absolute',
            top: '48%',
            left: '52%',
            width: 24 / 2,
            height: 24 / 4,
            backgroundColor: 'transparent',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            border: '2.5px solid white',
            borderTop: 'none',
            borderRight: 'none',
            display: checked ? 'block' : 'none',
          }}
        />
      </span>
    </div>
  )
}

import * as React from 'react'
import { LsFontFamily, LsFontWeight, LsFontSize } from '@/constants/ls-fonts'
import { LsColor } from '@/constants/ls-color'

export interface Props {
    family?: LsFontFamily
    size?: LsFontSize
    weight?: LsFontWeight
    color?: string
    maxLines?: number
    align?: 'left' | 'center'
}

export function LsText({
    family = LsFontFamily.GeistMono,
    size = LsFontSize.Base,
    weight = LsFontWeight.Bold,
    color = LsColor.White,
    maxLines,
    align = 'left',
    children,
}: React.PropsWithChildren<Props>) {
    return (
        <span
            style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: maxLines,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'light',
                wordBreak: maxLines ? 'break-word' : undefined,
                lineHeight: '1.2',
                textAlign: align,
                fontSize: size,
                fontWeight: weight,
                fontFamily: family,
                fontStyle: 'light',
                color,
            }}
        >
            {children}
        </span>
    )
}

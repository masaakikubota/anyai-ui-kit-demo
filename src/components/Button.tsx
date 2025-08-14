import React from 'react'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'secondary'|'ghost'|'destructive', size?: 'sm'|'md'|'lg' }
export default function Button({ variant='primary', size='md', className='', ...props }: Props) {
  const base = 'btn'
  const v = { primary:'btn-primary', secondary:'btn-secondary', ghost:'btn-ghost', destructive:'btn-destructive' }[variant]
  const s = { sm:'h-7 px-3 text-sm', md:'h-9 px-4 text-sm', lg:'h-11 px-5 text-base' }[size]
  return <button className={[base,v,s,className].join(' ')} {...props} />
}

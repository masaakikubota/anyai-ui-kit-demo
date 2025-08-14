import React from 'react'
export function Card({ children, className='' }: React.PropsWithChildren<{className?:string}>) {
  return <div className={['card', className].join(' ')}>{children}</div>
}
export function CardHeader({ children, className='' }: React.PropsWithChildren<{className?:string}>) {
  return <div className={['card-header', className].join(' ')}>{children}</div>
}
export function CardBody({ children, className='' }: React.PropsWithChildren<{className?:string}>) {
  return <div className={['card-body', className].join(' ')}>{children}</div>
}

import React from 'react'
export default function Bubble({ role='assistant', children }:{role?:'user'|'assistant', children:React.ReactNode}) {
  const isUser = role==='user'
  const cls = 'bubble ' + (isUser ? 'bubble-user' : 'bubble-assistant')
  return <div className={'flex ' + (isUser? 'justify-end':'justify-start')}><div className={cls}>{children}</div></div>
}

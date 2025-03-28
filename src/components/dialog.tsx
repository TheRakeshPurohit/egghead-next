import React, {FunctionComponent} from 'react'
import {DialogOverlay, DialogContent} from '@reach/dialog'
import IconX from '@/components/icons/icon-x'

type DialogProps = {
  children: React.ReactNode
  ariaLabel: string
  title: string
  buttonText: string
  buttonStyles: string
  disabled: boolean | undefined
}
const Dialog: FunctionComponent<React.PropsWithChildren<DialogProps>> = ({
  children,
  ariaLabel,
  title,
  buttonText,
  buttonStyles = '',
  disabled = false,
}) => {
  const [showDialog, setShowDialog] = React.useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  return (
    <div>
      <button disabled={disabled} onClick={open} className={buttonStyles}>
        {buttonText}
      </button>
      <DialogOverlay isOpen={showDialog} onDismiss={close}>
        <DialogContent
          aria-label={ariaLabel}
          className="bg-gray-50 dark:bg-gray-1000 rounded-md border-gray-400 p-8 w-11/12 sm:w-1/2"
        >
          <div className="flex justify-center relative mb-6">
            {title && <h3 className="text-xl font-medium">{title}</h3>}
            <button onClick={close} className="absolute right-0 top-0">
              <IconX className="w-5" />
            </button>
          </div>
          {children}
        </DialogContent>
      </DialogOverlay>
    </div>
  )
}

export default Dialog

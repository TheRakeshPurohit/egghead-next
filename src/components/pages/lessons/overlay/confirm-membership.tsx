import * as React from 'react'
import Image from 'next/legacy/image'
import Spinner from '@/components/spinner'
import usePurchaseAndPlay from '@/hooks/use-purchase-and-play'
import axios from 'axios'
import {track} from '@/utils/analytics'
import {useViewer} from '@/context/viewer-context'
import {LessonResource} from '../../../../types'
import {useRouter} from 'next/router'

type HeaderProps = {
  heading: React.ReactElement
  primaryMessage: React.ReactElement
}

type ConfirmMembershipProps = {
  sessionId: string
  viewLesson: Function
  lesson: {
    slug: string
  }
}

const Illustration = () => (
  <div>
    <Image
      src={
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606467216/next.egghead.io/eggodex/playful-eggo_2x.png'
      }
      width={646 / 4}
      height={622 / 4}
      quality={100}
      alt="welcome to egghead"
    />
  </div>
)

const Heading: React.FC<React.PropsWithChildren<unknown>> = ({children}) => {
  return (
    <h1 className="text-xl font-medium leading-tight text-center sm:leading-tighter sm:text-2xl">
      {children}
    </h1>
  )
}

const PrimaryMessage: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <div className="max-w-md">{children}</div>
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  heading,
  primaryMessage,
}) => {
  return (
    <header className="flex flex-col items-center justify-center w-full h-full p-5">
      <div className="flex flex-col items-center justify-center space-y-6">
        <Illustration />
        <Heading>{heading}</Heading>
        <PrimaryMessage>{primaryMessage}</PrimaryMessage>
      </div>
    </header>
  )
}

const IconMail: React.FC<React.PropsWithChildren<{className: string}>> = ({
  className,
}) => {
  return (
    <div className={className}>
      <svg
        className="transition-transform transform animate-bounce"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none">
          <path
            d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z"
            fill="currentColor"
          />
          <path
            d="M18 8.118l-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  )
}

const Callout: React.FC<React.PropsWithChildren<unknown>> = ({children}) => {
  return (
    <div className="inline-flex items-center w-full p-4 mb-5 space-x-3 border border-gray-200 rounded-lg sm:p-5">
      {children}
    </div>
  )
}

const ExistingMemberConfirmation: React.FC<
  React.PropsWithChildren<{
    session: any
    viewLesson: Function
    lesson: {
      slug: string
    }
  }>
> = ({session, viewLesson, lesson}) => {
  return (
    <>
      <Header
        heading={<>Thank you so much for joining egghead!</>}
        primaryMessage={
          <div className="flex flex-col items-center">
            <p className="text-lg text-center">
              We've charged your credit card{' '}
              <strong>${session.amount} for your egghead membership</strong> and
              sent a receipt to <strong>{session.email}</strong>.
            </p>
            <p className="pt-5 text-lg text-center">
              You can now learn from all premium resources on egghead, including
              courses, talks, podcasts, articles, and more. Enjoy!
            </p>
            <button
              className="mt-8 px-10 py-4 h-[60px] font-medium flex justify-center items-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105 self-center"
              onClick={(_e) => {
                track('clicked watch lesson', {
                  location: 'pay and play on lesson',
                  lesson: lesson.slug,
                })
                viewLesson()
              }}
            >
              Watch this Lesson
            </button>
          </div>
        }
      />
    </>
  )
}

const NewMemberConfirmation: React.FC<
  React.PropsWithChildren<{
    session: any
    currentState: any
  }>
> = ({session, currentState}) => {
  return (
    <Header
      heading={<>Thank you so much for joining egghead! </>}
      primaryMessage={
        <>
          {currentState.matches('pollingExpired') && (
            <>
              <Callout>
                <IconMail className="p-3 rounded-full dark:bg-rose-500 dark:text-white bg-rose-100 text-rose-500" />
                <p className="text-lg">
                  Please check your inbox ({session.email}) to{' '}
                  <strong>confirm your email address</strong> and{' '}
                  <strong>access your membership</strong>.
                </p>
              </Callout>
              <p className="text-lg text-center">
                We've charged your credit card{' '}
                <strong>${session.amount} for an egghead membership</strong> and
                sent an email along with a receipt to{' '}
                <strong>{session.email}</strong> so you can log in and access
                your membership.
              </p>
            </>
          )}
        </>
      }
    />
  )
}

const LoadingSession: React.FC<React.PropsWithChildren<{}>> = () => {
  return (
    <Header
      heading={<>Thank you so much for joining egghead! </>}
      primaryMessage={
        <Callout>
          <Spinner color="white" />
          <p className="text-lg">Setting up your account...</p>
        </Callout>
      }
    />
  )
}

const NoSessionFound = () => {
  return (
    <Header
      heading={<>Thank you so much for joining egghead! </>}
      primaryMessage={
        <>
          <Callout>
            <IconMail className="p-3 rounded-full dark:bg-rose-500 dark:text-white bg-rose-100 text-rose-500" />
            <p className="text-lg">
              Please check your inbox to{' '}
              <strong>confirm your email address</strong> and{' '}
              <strong>access your membership</strong>.
            </p>
          </Callout>
          <p className="text-lg text-center">
            If you have any trouble, you can email{' '}
            <a
              href="mailto:support@egghead.io"
              className="dark:text-blue-400 text-blue-400 underline"
            >
              support@egghead.io
            </a>{' '}
            for help at any time.
          </p>
        </>
      }
    />
  )
}

const ConfirmMembership: React.FC<
  React.PropsWithChildren<ConfirmMembershipProps>
> = ({lesson, sessionId, viewLesson}) => {
  const router = useRouter()
  const [alreadyAuthenticated, currentState] = usePurchaseAndPlay()
  const [session, setSession] = React.useState<any>()
  const {viewer, refreshUser} = useViewer()
  const [loadingSession, setLoadingSession] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (sessionId) {
      axios
        .get(`/api/stripe/checkout/session?session_id=${sessionId}`)
        .then(({data}) => {
          setSession(data)
          track('checkout: membership confirmed', {
            sessionId,
            lesson: lesson.slug,
          })
          if (viewer) refreshUser()

          setLoadingSession(false)
        })
    }
  }, [sessionId])

  if (loadingSession || currentState.matches('pending'))
    return <LoadingSession />

  const {session_id, ...nonSessionQueryParams} = router.query

  const cleanUrlAndViewLesson = () => {
    router.replace({
      pathname: router.pathname,
      query: nonSessionQueryParams,
    })

    setTimeout(viewLesson, 750)
  }

  return session ? (
    <div className="w-full max-w-screen-lg mx-auto space-y-16 text-white dark:text-white">
      {alreadyAuthenticated || currentState.matches('authTokenRetrieved') ? (
        <ExistingMemberConfirmation
          lesson={lesson}
          session={session}
          viewLesson={cleanUrlAndViewLesson}
        />
      ) : (
        <NewMemberConfirmation session={session} currentState={currentState} />
      )}
    </div>
  ) : (
    <NoSessionFound />
  )
}

export default ConfirmMembership

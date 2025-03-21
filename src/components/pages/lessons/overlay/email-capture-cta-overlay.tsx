import React, {FunctionComponent} from 'react'
import LoginForm from '@/pages/login'
import {track} from '@/utils/analytics'
import {LessonResource} from '@/types'
import OverlayWrapper from '@/components/pages/lessons/overlay/wrapper'

type CreateAccountCTAProps = {
  lesson: LessonResource
  technology: string
}

const EmailCaptureCtaOverlay: FunctionComponent<
  React.PropsWithChildren<CreateAccountCTAProps>
> = ({lesson, technology}) => {
  const {collection} = lesson

  return (
    <OverlayWrapper>
      <section className="flex flex-col items-center justify-center p-4">
        <LoginForm
          image={<></>}
          className="w-full mx-auto flex flex-col items-center justify-center text-white"
          label="Email address"
          formClassName="max-w-xs md:max-w-sm mx-auto w-full"
          button="Finish Watching this Course"
          track={() => {
            const {slug} = lesson
            track('submitted email', {
              lesson: slug,
              technology,
              location: 'lesson overlay',
            })
          }}
        >
          <div className="text-center">
            {collection ? (
              <h2 className="text-xl md:text-2xl lg:text-xl xl:text-3xl leading-tighter tracking-tight font-light text-center max-w-xl mx-auto">
                Ready to finish{' '}
                <strong className="font-bold">{collection.title}</strong>?
              </h2>
            ) : (
              <h2 className="text-xl md:text-2xl lg:text-xl xl:text-3xl leading-tighter tracking-tight font-light text-center max-w-xl mx-auto">
                Unlock this free lesson!
              </h2>
            )}

            <h3 className="pt-4 text-lg leading-tighter tracking-tight font-light text-center max-w-xl mx-auto">
              This lesson (and hundreds more!) by awesome instructors like{' '}
              <br />
              {lesson.instructor.full_name} are{' '}
              <strong className="font-bold">free to watch</strong> with your
              egghead account.
            </h3>
            <p className="font-normal text-blue-300 text-base sm:text-md lg:text-base xl:text-md mt-4">
              Enter your email to unlock this free lesson.
            </p>
          </div>
        </LoginForm>
      </section>
    </OverlayWrapper>
  )
}

export default EmailCaptureCtaOverlay

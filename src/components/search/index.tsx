import React, {FunctionComponent} from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import Head from 'next/head'
import Hits from './hits'
import Stats from './stats'
import SearchBox from './search-box'
import RefinementList from './refinement-list'
import Pagination from './pagination'
import {Configure, InstantSearch, ClearRefinements} from 'react-instantsearch'
import {get, isEmpty} from 'lodash'
import {useToggle} from 'react-use'
import config from '@/lib/config'
import InstructorsIndex from '@/components/search/instructors/index'
import NoSearchResults from '@/components/search/components/no-search-results'
import SearchCuratedEssential from './curated/curated-essential'
import SearchInstructorEssential from './instructors/instructor-essential'
import CuratedTopicsIndex from './curated'
import {searchQueryToArray} from '../../utils/search/topic-extractor'
import Spinner from '@/components/spinner'
import {Element as ScrollElement, scroller} from 'react-scroll'
import SimpleBar from 'simplebar-react'
import cx from 'classnames'
import NewCuratedTopicPage from './curated/[slug]'
import Link from 'next/link'
import analytics from '@/utils/analytics'
import {TYPESENSE_COLLECTION_NAME} from '@/utils/typesense'
import PresetOptions from './components/preset-options'

type SearchProps = {
  searchClient?: any
  searchState?: any
  instructor?: any
  topic?: any
  topicData?: any
  loading?: boolean
  onSearchStateChange?: any
}

const queryClient = new QueryClient()

const Search: FunctionComponent<React.PropsWithChildren<SearchProps>> = ({
  children = [],
  searchClient,
  onSearchStateChange,
  searchState,
  instructor,
  topic,
  topicData,
  loading,
  ...rest
}) => {
  const [isFilterShown, setShowFilter] = useToggle(false)
  const noInstructorsSelected = (searchState: any) => {
    return get(searchState, 'refinementList.instructor_name', []).length === 0
  }

  const noTopicsSelected = (searchState: any) => {
    return (
      isEmpty(topic) &&
      get(searchState, 'refinementList._tags', []).length === 0
    )
  }

  const isRefinementOn =
    !isEmpty(get(searchState, 'refinementList.instructor_name')) ||
    !isEmpty(get(searchState, 'refinementList._tags')) ||
    !isEmpty(get(searchState, 'refinementList.access_state')) ||
    !isEmpty(get(searchState, 'refinementList.type'))

  const numberOfRefinements =
    get(searchState, 'refinementList.instructor_name', []).length +
    get(searchState, 'refinementList._tags', []).length +
    get(searchState, 'refinementList.access_state', []).length +
    get(searchState, 'refinementList.type', []).length

  const searchBoxPlaceholder = !isEmpty(instructor)
    ? `Search resources by ${instructor.full_name}`
    : undefined

  const shouldDisplayLandingPageForTopics = (topic: any) => {
    if (!topic) return false

    const terms = searchQueryToArray(searchState)

    return (
      (isEmpty(searchState.query) ||
        (terms.includes(topic.name) && terms.length === 1)) &&
      isEmpty(searchState.page) &&
      noInstructorsSelected(searchState)
    )
  }

  const shouldDisplayLandingPageForInstructor = (slug: string) => {
    return (
      isEmpty(searchState.query) &&
      isEmpty(searchState.page) &&
      noTopicsSelected(searchState)
    )
  }

  const InstructorCuratedPage =
    instructor &&
    (InstructorsIndex[instructor.slug] || SearchInstructorEssential)

  const CuratedTopicPage =
    topic && (CuratedTopicsIndex[topic.name] || SearchCuratedEssential)

  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Scrolls to hits if the user is using pagination to navigate results
  // Scrolls to the top otherwise
  React.useEffect(() => {
    if (mounted) {
      const currentPage = get(searchState, 'page', 0)
      if (currentPage && parseInt(currentPage) > 1) {
        scroller.scrollTo('hits', {
          offset: -47,
        })
      } else {
        scroller.scrollTo('page', {})
      }
    }
  }, [searchState, mounted])

  const FilterToggle = () => {
    return (
      <button
        onClick={setShowFilter}
        className={`z-40 fixed bottom-3 right-3 bg-blue-500 text-white rounded-full sm:hidden flex items-center px-4 text-sm font-medium py-2`}
      >
        <span className="pr-1">Filter</span>
        {numberOfRefinements > 0 ? (
          <div className="flex items-center justify-center w-6 h-6 -mr-1 text-xs font-bold text-white transform scale-75 bg-blue-600 rounded-full">
            {numberOfRefinements}
          </div>
        ) : (
          <>
            {isFilterShown ? (
              // prettier-ignore
              <svg className="sm:ml-1" width="14" height="14" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z" fill="currentColor"/></g></svg>
            ) : (
              // prettier-ignore
              <svg className="sm:ml-1" xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12"><g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transform="translate(1 1)"><line x1="3.5" x2="3.5" y1="5"/><line x1=".5" x2="3.5" y1="2.5" y2="2.5"/><line x1="5.5" x2="11.5" y1="2.5" y2="2.5"/><line x1="8.5" x2="8.5" y1="10" y2="5"/><line x1="11.5" x2="8.5" y1="7.5" y2="7.5"/><line x1="6.5" x2=".5" y1="7.5" y2="7.5"/></g></svg>
            )}
          </>
        )}
      </button>
    )
  }

  const RefinementsDesktop = () => {
    return (
      <aside className="col-span-2 md:block hidden relative flex-shrink-0 dark:bg-gray-1000 bg-gray-100 pl-4">
        <SimpleBar className="sticky top-0 space-y-4 max-h-screen overflow-y-auto pb-8 pt-3">
          <div className="space-y-4">
            <RefinementList limit={8} attribute="_tags" />
            <RefinementList limit={6} attribute="instructor_name" />
            <RefinementList attribute="access_state" />
            <RefinementList attribute="type" />
            <TeamButton />
          </div>
        </SimpleBar>
      </aside>
    )
  }

  const TeamButton = () => {
    return (
      <section className="flex flex-col items-center sm:pb-32 pt-3 pb-16 w-full h-full">
        <Link
          passHref
          onClick={() => {
            analytics.events.activityInternalLinkClick(
              'CTA',
              'browser page',
              'egghead for teams',
              '/pricing',
            )
          }}
          href="/pricing"
          className="bg-gradient-to-b from-amber-300 to-amber-400 text-black rounded-md px-4 py-2 font-medium text-sm dark:border border-amber-500/50 hover:brightness-110 transition shadow-2xl shadow-amber-300/20"
        >
          Level Up Your Team
        </Link>
      </section>
    )
  }

  const RefinementsMobile = () => {
    return (
      <div
        className={`rounded-t-md overflow-hidden fixed bottom-0 left-0 z-30 dark:bg-gray-800 bg-gray-100 drop-shadow-2xl transition-all ease-in-out duration-150 w-full max-h-[350px] ${cx(
          {
            'md:hidden block visible opacity-100 translate-y-0': isFilterShown,
            'md:hidden hidden invisible opacity-0 translate-y-5':
              !isFilterShown,
          },
        )}`}
      >
        <div className="w-full flex items-center justify-between dark:bg-gray-700 bg-white dark:bg-opacity-60 text-sm">
          <div className="p-1">{isRefinementOn && <ClearRefinements />}</div>
          <button className="px-3 py-2 rounded-md" onClick={setShowFilter}>
            Done
          </button>
        </div>
        <SimpleBar className="max-h-[300px] px-1 py-2">
          <div className="grid grid-cols-2 gap-5 w-full">
            <div className="flex-shrink-0">
              <RefinementList limit={6} attribute="_tags" />
            </div>
            <div className="flex-shrink-0">
              <RefinementList limit={6} attribute="instructor_name" />
            </div>
            <div className="flex-shrink-0">
              <RefinementList attribute="access_state" />
            </div>
            <div className="flex-shrink-0">
              <RefinementList attribute="type" />
            </div>
          </div>
          <div className="justify-center mt-4">
            <TeamButton />
          </div>
        </SimpleBar>
      </div>
    )
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/instantsearch.css@8.1.0/themes/reset-min.css"
        />
      </Head>
      <div className="dark:bg-gray-1000 bg-gray-100 relative">
        <InstantSearch
          indexName={TYPESENSE_COLLECTION_NAME}
          searchClient={searchClient}
          onStateChange={onSearchStateChange}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
          initialUiState={{
            [TYPESENSE_COLLECTION_NAME]: {
              ...searchState,
            },
          }}
          {...rest}
        >
          <Configure hitsPerPage={config.searchResultCount} />
          <ScrollElement name="page" />
          {!isFilterShown && <FilterToggle />}
          <div className="max-w-screen-xl mx-auto w-full">
            <div>
              <div className="md:grid flex grid-cols-12 relative gap-3">
                {RefinementsDesktop()}
                {RefinementsMobile()}
                <main className="col-span-10 flex flex-col w-full relative dark:bg-gray-900 bg-gray-50">
                  {!loading && isEmpty(instructor) && isEmpty(topic) && (
                    <h1 className="hidden">Search</h1>
                  )}
                  <div className="dark:bg-gray-900 bg-white sticky top-0 z-40 shadow-smooth flex items-center w-full border-b dark:border-white border-gray-900 dark:border-opacity-5 border-opacity-5">
                    <SearchBox placeholder={searchBoxPlaceholder} />
                    <div className="border-l dark:border-gray-800 border-gray-100 flex items-center flex-shrink-0 space-x-2 flex-nowrap h-full">
                      <PresetOptions />
                    </div>
                  </div>
                  {!loading && (
                    <NoSearchResults searchQuery={searchState?.query ?? ''} />
                  )}
                  {loading && shouldDisplayLandingPageForTopics(topic) && (
                    <div className="flex py-8 justify-center">
                      <Spinner
                        size={8}
                        className="dark:text-gray-300 text-gray-600"
                      />
                    </div>
                  )}
                  {!loading && shouldDisplayLandingPageForTopics(topic) && (
                    <>
                      {isEmpty(topicData) ? (
                        CuratedTopicPage && (
                          // TODO: create more topic pages in Sanity and deprecate
                          // following component in favor of approach below
                          <div className="px-5">
                            <CuratedTopicPage topic={topic} />
                          </div>
                        )
                      ) : (
                        // dynamic topic from page resource in Sanity
                        <NewCuratedTopicPage
                          topicData={topicData}
                          topic={topic}
                        />
                      )}
                    </>
                  )}

                  {!isEmpty(instructor) &&
                    shouldDisplayLandingPageForInstructor(instructor.slug) && (
                      <div className="pb-8 px-5">
                        <InstructorCuratedPage instructor={instructor} />
                      </div>
                    )}
                  <ScrollElement name="hits" />
                  <Stats searchQuery={searchState?.query ?? ''} />
                  <h2 className="sm:px-5 px-3 mt-4 lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
                    Search Results
                  </h2>
                  <QueryClientProvider client={queryClient}>
                    <Hits />
                  </QueryClientProvider>
                  {mounted && (
                    <div className="pb-16 pt-10 flex-grow bg-gradient-to-t dark:from-gray-1000 dark:to-transparent from-gray-100 to-transparent">
                      <Pagination />
                    </div>
                  )}
                </main>
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </>
  )
}

export default Search

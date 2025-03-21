import * as React from 'react'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'caseStudy',
  type: 'document',
  title: 'Case Study',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Titles should be catchy, descriptive, and not too long',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subTitle',
      description: 'Short punchy bit of text.',
      title: 'Sub-Title',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published at',
      description: 'This can be used to schedule case study for publishing',
    }),
    defineField({
      name: 'description',
      type: 'markdown',
      title: 'Description',
      description:
        'This can be used to provide a short description of the article. Max 150 characters',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'body',
      type: 'markdown',
      title: 'Body',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      validation: (Rule) => Rule.required(),
      description: 'Some frontends will require a slug to be set to be able to show the case study',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'coverImage',
      type: 'image-url',
      title: 'Cover image',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      title: 'SEO',
    }),
    defineField({
      name: 'excerpt',
      type: 'markdown',
      title: 'Excerpt',
      description:
        'This ends up on summary pages, on Google, when people share your case study in social media.',
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      description: 'Humans that worked on the case study and get credit for the effort.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'authorReference',
        }),
      ],
    }),
    defineField({
      name: 'featuredInstructors',
      description: 'Instructor(s) featured in the case study.',
      title: 'Featured Instructors',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'collaborator'}],
        }),
      ],
    }),
    defineField({
      name: 'resources',
      description:
        'Arbitrary resources, maybe this is a collection? Internal to this resource (not shared at the top level)',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'resource',
          title: 'Resource',
        }),
        defineArrayMember({
          type: 'reference',
          title: 'Resources Refs',
          to: [{type: 'resource'}],
        }),
      ],
    }),
    defineField({
      name: 'projects',
      description: 'Related Project Resources',
      title: 'Projects',
      type: 'array',
      of: [
        defineArrayMember({type: 'link'}),
        defineArrayMember({
          type: 'resource',
          title: 'Resource',
        }),
        defineArrayMember({
          type: 'reference',
          title: 'Resources Refs',
          to: [{type: 'resource'}],
        }),
      ],
    }),
  ],
  orderings: [
    {
      name: 'publishingDateAsc',
      title: 'Publishing date new–>old',
      by: [
        {
          field: 'publishedAt',
          direction: 'asc',
        },
        {
          field: 'title',
          direction: 'asc',
        },
      ],
    },
    {
      name: 'publishingDateDesc',
      title: 'Publishing date old->new',
      by: [
        {
          field: 'publishedAt',
          direction: 'desc',
        },
        {
          field: 'title',
          direction: 'asc',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      slug: 'slug',
      image: 'coverImage.url',
    },
    prepare({title = 'No title', publishedAt, slug = {}, image}: any) {
      const path = `/case-studies/${slug.current}`
      return {
        title,
        subtitle: publishedAt ? path : 'Missing publishing date',
        media: image ? <img src={image} alt={`${title} preview`} /> : null,
      }
    },
  },
})

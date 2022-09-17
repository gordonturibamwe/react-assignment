import React from 'react'
import { SuperSEO } from "react-super-seo";

export default function SEO({...props}) {
  return (
    <SuperSEO
      title={props.title} // "Home | React Super SEO"
      description={props.description} // "React SEO component with OpenGraph and Twitter Cards support."
      lang="en"
      openGraph={{
        ogImage: {
          ogImage: props.image, // "http://placekitten.com/1200/630",
          ogImageAlt: props.imageAlt, //
          ogImageWidth:  props.imageWidth, // ,
          ogImageHeight:  props.imageHeight, //
          ogImageType: "image/jpeg",
        },
      }}
      twitter={{
        twitterSummaryCard: {
          summaryCardImage: props.image, //"http://placekitten.com/1200/630",
          summaryCardImageAlt: props.imageAlt, // "Kittens",
          summaryCardSiteUsername: props.imageAlt, // "justinmahar",
        },
      }}
    />
  )
}

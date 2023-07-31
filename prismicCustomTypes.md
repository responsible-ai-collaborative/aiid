# Prismic Custom Types

## How to create a new Custom Type
1. From the prismic left menu click `Custom Types`
2. Click `Create new custom type`
3. Give it a name (please use the names provided below)
4. Click `JSON editor`
5. Paste the JSON content from the predefined custom types below
6. Click `Save`

## Project custom types JSONs
In order to facilitate the creation of custom types here is the list of the ones you'll need.

###  1. Blog custom type

name: `blog`

JSON:
```
{
  "Main": {
    "uid": {
      "type": "UID",
      "config": {
        "label": "uid",
        "placeholder": "UID"
      }
    },
    "metadescription": {
      "type": "Text",
      "config": {
        "label": "metaDescription*",
        "placeholder": "Summary of the blog post's content (mandatory)"
      }
    },
    "metatitle": {
      "type": "Text",
      "config": {
        "label": "metaTitle*",
        "placeholder": "Title of the blog post (mandatory)"
      }
    },
    "slug": {
      "type": "Text",
      "config": {
        "label": "slug*",
        "placeholder": "The last part of the URL address that serves as a unique identifier of the page. The same blog post but in different locale should have the same slug (mandatory)"
      }
    },
    "language": {
      "type": "Text",
      "config": {
        "label": "language*",
        "placeholder": "en, es or fr (mandatory)"
      }
    },
    "aitranslated": {
      "type": "Boolean",
      "config": {
        "placeholder_false": "false (the post is in its original language or has been translated manually)",
        "placeholder_true": "true (this post has been translated with AI)",
        "default_value": false,
        "label": "aiTranslated"
      }
    },
    "title": {
      "type": "StructuredText",
      "config": {
        "single": "heading1",
        "label": "Main title*",
        "placeholder": "Title of the blog post (mandatory)"
      }
    },
    "date": {
      "type": "Date",
      "config": {
        "label": "Post Date*",
        "placeholder": "Date when the post was created/published (mandatory)"
      }
    },
    "author": {
      "type": "Text",
      "config": {
        "label": "Author(s)*",
        "placeholder": "Who wrote this blog post, could be multiple authors (mandatory)"
      }
    },
    "content": {
      "type": "StructuredText",
      "config": {
        "multi": "paragraph,preformatted,heading1,heading2,heading3,heading4,heading5,heading6,strong,em,hyperlink,image,embed,list-item,o-list-item,rtl",
        "allowTargetBlank": true,
        "label": "Content*",
        "placeholder": "Rich text with the content of the blog post (mandatory)"
      }
    },
    "image": {
      "type": "Image",
      "config": {
        "constraint": {},
        "thumbnails": [],
        "label": "Post's main image*"
      }
    }
  }
}
```

###  2. Sponsor custom type

name: `sponsor`

JSON:
```
{
  "Main": {
    "title": {
      "type": "StructuredText",
      "config": {
        "single": "heading6",
        "label": "Title",
        "placeholder": "Sponsor(s) card title"
      }
    },
    "language": {
      "type": "StructuredText",
      "config": {
        "single": "heading6",
        "label": "language",
        "placeholder": "Language (en, es or fr)"
      }
    },
    "order": {
      "type": "StructuredText",
      "config": {
        "single": "heading6",
        "label": "Order",
        "placeholder": "The order you wish the sponsor to appear"
      }
    },
    "items": {
      "type": "Group",
      "config": {
        "fields": {
          "logo": {
            "type": "Image",
            "config": {
              "constraint": {},
              "thumbnails": [],
              "label": "Logo"
            }
          },
          "name": {
            "type": "StructuredText",
            "config": {
              "single": "heading5",
              "label": "name",
              "placeholder": "Sponsor's name"
            }
          },
          "description": {
            "type": "StructuredText",
            "config": {
              "multi": "paragraph,preformatted,heading1,heading2,heading3,heading4,heading5,heading6,strong,em,hyperlink,image,embed,list-item,o-list-item,rtl",
              "allowTargetBlank": true,
              "label": "description",
              "placeholder": "Sponsor's description"
            }
          },
          "link": {
            "type": "Link",
            "config": {
              "label": "link",
              "select": null,
              "allowTargetBlank": true,
              "placeholder": "Logo's link"
            }
          }
        },
        "label": "Sponsor's info"
      }
    }
  }
}
```
---
layout: post
title: Using Google Forms for Waitlists and Launches
date: '2025-01-14T12:00:00+01:00'
tags:
- google-forms
- javascript
- web-development
---

Over the last decade, I've spun up quite a few landing pages to gauge interest for upcoming products and features. Back in the day, there were platforms like [Launchrock](https://www.launchrock.com/) that made it simple to collect email addresses and maintain a waitlist. While Launchrock (and later [Typeform](https://www.typeform.com/), etc.) provided decent user experiences at the time, the end goal was always the same: **collect user data into a spreadsheet (or CRM).**

Nowadays, I still want the same functionality (i.e., capturing emails and other user info), but I want it to _look native_ on my site. Embedding a big Google Form or Typeform often looks clunky because it's just an iframe that's visually out of sync with the rest of the site.

## The Problem

When I launched [Notipus](https://notipus.com), I faced this problem again. How could I have my own custom input fields on the site, yet still write the data directly into a Google Sheet (or form backend)?

Of course, one could solve this by spinning up a simple backend service to handle form submissions, but I wanted to avoid the overhead of maintaining yet another service. The goal was to keep things simple and leverage existing infrastructure.

I discovered a solution using **Google Apps Script** that effectively acts as a wrapper for a Google Form. This means I can collect submissions from a _native_ HTML form on my site and directly post it to a Google Form, which then writes to the associated Google Sheet.

## The Repo

If you want to see this in the wild, take a look at the GitHub repo: [Viktopia/notipus.com](https://github.com/Viktopia/notipus.com). In particular, check out the form implementation ([form.html](https://github.com/Viktopia/notipus.com/blob/master/form.html)).

## The Script

Below is the complete Google Apps Script I use. You'd attach this to the Google Form's script editor (explained in the next section). This script supports JSONP (i.e., `callback(...)`) so you can handle the response in a more flexible way client-side.

```js
// Get your form ID from the URL of your Google Form
const FORM_ID = FormApp.getActiveForm().getId();

function doGet(e) {
  // Get the callback name from the request
  const callback = e.parameter.callback || 'callback';

  try {
    // Get the form data from parameters
    const firstName = e.parameter.firstName || '';
    const lastName = e.parameter.lastName || '';
    const company = e.parameter.company || '';
    const email = e.parameter.email || '';

    // Get the form
    const form = FormApp.openById(FORM_ID);

    // Create a new response
    const formResponse = form.createResponse();

    // Get all form items
    const items = form.getItems();

    // Map items to fields based on their titles
    items.forEach(item => {
      const title = item.getTitle().toLowerCase();
      let response = null;

      if (title.includes('first name')) {
        response = item.asTextItem().createResponse(firstName);
      } else if (title.includes('last name')) {
        response = item.asTextItem().createResponse(lastName);
      } else if (title.includes('company')) {
        response = item.asTextItem().createResponse(company);
      } else if (title.includes('email')) {
        response = item.asTextItem().createResponse(email);
      }

      if (response) {
        formResponse.withItemResponse(response);
      }
    });

    // Submit the form response
    formResponse.submit();

    // Return success response wrapped in JSONP callback
    const jsonResponse = JSON.stringify({
      success: true,
      message: 'Form submitted successfully',
      formId: FORM_ID
    });
    return ContentService.createTextOutput(`${callback}(${jsonResponse})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);

  } catch (error) {
    console.error('Error:', error);
    // Return error response wrapped in JSONP callback
    const jsonResponse = JSON.stringify({
      success: false,
      error: error.toString(),
      formId: FORM_ID
    });
    return ContentService.createTextOutput(`${callback}(${jsonResponse})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

// Function to get form details
function getFormDetails() {
  const form = FormApp.getActiveForm();
  const items = form.getItems();

  console.log('Form Details:');
  console.log('Form ID:', form.getId());
  console.log('Form Title:', form.getTitle());
  console.log('\nForm Items:');
  items.forEach(item => {
    console.log(`Title: ${item.getTitle()}, ID: ${item.getId()}, Type: ${item.getType()}`);
  });
}
```

### Setting Up the Script in Your Google Form

1. **Create a Google Form** (or open an existing one).
2. **Open the Script Editor**: In the Form editor, click on the vertical dots in the top-right corner and select **Script editor**.
3. **Paste the Code**: Remove any existing code and paste in the script above.
4. **Save and Deploy**:
   - Click **Deploy > New deployment**.
   - Choose **Type**: "Web app".
   - Make sure you set:
     - **Execute the app as**: _Me_ (i.e., your Google account).
     - **Who has access**: _Anyone_.
   - Once deployed, you'll get a `webApp URL`. This is the endpoint you'll POST (or GET) to with your form fields.
5. **Grant Permissions**: The first time you deploy, you'll be asked to grant permissions. Since this script writes to the Form and the associated Sheet on your behalf, the permission request is expected.

From here, your custom HTML form can submit data directly to this Google Apps Script endpoint. The script will then create a new submission in the actual Google Form (and thus populate your Google Sheet). No ugly iframes required!

## Wrapping Up

With this approach, you keep a fully native look and feel on your landing page, while still leveraging the power of Google Forms and Sheets. There's still room for improvement (like adding Captcha), but it's a solid start. If you're looking to see how it's implemented in a real project, check out [Notipus on GitHub](https://github.com/Viktopia/notipus.com).

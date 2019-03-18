# lambda-chimp

To use, first build locally and use npm to pull down dependencies.  Then put all files, including the the node_modules folder into a .zip folder and upload to your AWS Lambda resource.

There are four environment variables in use:

`MAILCHIMP_API_KEY`: Your mailchimp API key.

`LIST_ID`: Your mailchimp list ID

`THANK_YOU_PAGE`: The full URL to a page to redirect to upon successful add/update of subscriber.

`SOMETHING_WENT_WRONG_PAGE`: The full URL to a page when something goes wrong (currently not every error scenario is handled this way, some errors will simply return an HTTP 500.)

Put your lambda behind an API Gateway and test by posting an HTTP form to the API endpoint with three fields: **email**, **tag**, and **signupLocation**.  The tag must be created manually via Mailchimp's website and must already exist.  This code expects all fields to be filled out.

If the email address is already on your email list, it will simply append to the signup location merge field and add the tag.
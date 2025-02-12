# Vercel Deployment

1. __Vercel Account__: Make sure you have access to a Vercel account.

2. __Connect to GitHub__: During signup or from your Vercel settings, connect your Vercel account to your GitHub account. This will allow Vercel to access your `GitHub` repositories.

3. __Import Project__: Go to the Vercel dashboard and click on "Import Project". Select "Import from Git" and choose `GitHub` as your provider.

4. __Authorize Vercel__: Authorize Vercel to access your `GitHub` repositories if prompted.

5. __Select Repository__: Select the private repository you want to deploy from your `GitHub` account.

6. __Project Settings__: Vercel will scan your repository for a package.json file and populate the project settings based on that. You can review and adjust these settings like build commands and environment variables if needed.

7. __Environment Variables__: You can set environment variables directly in the Vercel dashboard under the project settings. Click on "Environment Variables" and add new variables with their corresponding names and values. These variables will be securely stored and accessible to your application during deployment.

8. __Deployment__: Once you're happy with the settings, click on "Deploy". Vercel will start building and deploying your project.


# Binding Domain from Namecheap

1. __Domain Name__: Make sure you have a domain name registered with `Namecheap`.

2. __Vercel Domain Settings__: Once the Vercel deployment is successful, navigate to the project settings in your Vercel dashboard. There should be a domain settings section.

3. __Add Domain__: Click on "Add Domain" and enter your domain name from `Namecheap`.

4. __Verification__: Vercel will provide you with verification instructions typically involving adding a CNAME record to your domain's DNS settings at `Namecheap`.

5. __Namecheap DNS Settings__: Log in to your `Namecheap` account and go to your domain's management settings. Look for a section on DNS or nameservers.

6. __Add CNAME Record__: Here, you'll need to add a __CNAME__ record as instructed by Vercel. The __CNAME__ record will typically point your domain name to Vercel's provided subdomain for your project.

7. __Save Changes__: Save the changes you made to your DNS settings at Namecheap. DNS propagation can vary, but it typically takes up to `24 hours` for your domain name to start resolving to your Vercel deployment. While in some cases it can be much quicker, within just `a few minutes`, allow enough time for the update to propagate across the internet.
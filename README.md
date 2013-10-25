# twists

Simple tool for creating twitter list members

## Usage

1. Create a [twitter app](https://dev.twitter.com/apps) with read and **write** access.
2. You should generate the "access token" on the twitter dev site for the account you whose list you'll be managing.
3. Clone this project (or download it, as you please).
4. Modify the file called `config.json` adding your secret tokens (make sure you keep this safe).
5. Create a file with all the twitter screen names you want to add (as plain text).
6. Open your terminal program and run the following command (whilst in the `twists` directory):

```
node index.js <screen_name>/<list_slug> <members.file>
```

For example:

```
node index.js fullfrontalconf/delegates13 members.txt
```

I hope to create a public tool in the future to make this a lot more user friendly, but for now, this does the job.
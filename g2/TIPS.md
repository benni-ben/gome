# Tips

I have been maintaining this project for a while, and I have learned a lot about web development, and I have also learned a lot about how to make a good game website. Here are some suggestions that I came up with to lower costs of running my game website:

| Method | Description | Implementation |
|:---:|:---:|:---:|
| Compressing | To compress and reduce overall file size, I try to remove anything that does not need to be there in the games. For example, comments or unused monetization code can be removed. | I do this by copying comments or unnecessary code that appear in multiple files, and using VSCode's search function to search for all occurances and replace. This can be done with large SDK code too. |
| Test Games | Due to the complexity of the games, they can sometimes not work due to path errors, domain detection, and more. | Check the code for functions that check for these, and test games when they are added. |
| Reroute Repeating Assets | Most games use game engines, which can have assets and images which are copied multiple times, which is unnecessary. You can reroute these assets to use a single folder(ideally in the root or whatever asset folder you have) to save space and make the assets load faster. | Find images, and other content on the page, and see if any other games have the same assets. Then, reroute the assets to a single folder. For example, with Unity WebGL games, the CSS file can be easily edited at scale with VSCode's search and replace function to use your centralized asset folder. |
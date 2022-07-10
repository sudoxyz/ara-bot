/**
 * Handle specific errors with a response
 *
 * @param { string } message
 * @param { string | Error } error
 * @returns { Message | MessageReact | undefined }
 */
module.exports = (message, error) =>
  message
    .reply(error.message ?? error)
    .then(() => message.react('❌'))
    .catch(() => {});

function composeCommand(options) {
  /**
   * Force uncoloured outputs so we can match output strings without stepping
   * around ANSI colour codes.
   */
  return `node ./bin/cli.js trade ${options} --no-colour`;
}

export { composeCommand };

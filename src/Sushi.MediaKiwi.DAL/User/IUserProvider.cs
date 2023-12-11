namespace Sushi.MediaKiwi.DAL.User
{
    /// <summary>
    /// Defines methods to get current user information.
    /// </summary>
    public interface IUserProvider
    {
        /// <summary>
        /// Gets the current <see cref="Actor"/>.
        /// </summary>
        /// <returns></returns>
        public Actor GetActor();

        /// <summary>
        /// Gets the current actor Role
        /// </summary>
        /// <returns></returns>
        public string GetRole();
    }
}

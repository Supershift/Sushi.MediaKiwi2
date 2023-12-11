namespace Sushi.MediaKiwi.DAL.User
{
    /// <summary>
    /// Defines types for <see cref="Actor"/>.
    /// </summary>
    public enum ActorType
    {
        /// <summary>
        /// A human user.
        /// </summary>
        User = 1,
        /// <summary>
        /// An application, e.g. an app registration in Entra ID.
        /// </summary>
        Application = 2
    }
}

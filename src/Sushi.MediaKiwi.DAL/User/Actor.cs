namespace Sushi.MediaKiwi.DAL.User
{
    /// <summary>
    /// Represents the actor for an operation, e.g. a user uploading keys or an application retrieving a key.
    /// </summary>
    public record Actor
    {
        private Actor() { }

        /// <summary>
        /// Creates a new instance of <see cref="Actor"/>.
        /// </summary>
        /// <param name="typeId"></param>
        /// <param name="id"></param>
        public Actor(ActorType typeId, Guid id)
        {
            TypeId = typeId;
            Id = id;
        }

        /// <summary>
        /// Type of the <see cref="Actor"/>.
        /// </summary>
        public ActorType TypeId { get; set; }
        /// <summary>
        /// Id of the <see cref="Actor"/>'s object in Entra ID, e.g. user id, app registration id.
        /// </summary>
        public Guid Id { get; set; }
    }
}

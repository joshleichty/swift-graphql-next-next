/**
 * Schema definition of the server.
 */
export const typeDefs = /* GraphQL */ `
  scalar DateTime

  """
  An object with an ID.
  """
  interface Node {
    """
    ID of the object.
    """
    id: ID!
  }

  type User implements Node {
    id: ID!

    """
    A nickname user has picked for themself.
    """
    username: String!

    """
    Profile picture of the user.
    """
    avatarURL: String
  }

  input Pagination {
    offset: Int

    """
    Number of items in a list that should be returned.

    NOTE: Maximum is 20 items.
    """
    take: Int
  }

  input Search {
    """
    String used to compare the name of the item to.
    """
    query: String!

    pagination: Pagination
  }

  # Query

  type Query {
    """
    Simple field that always returns "Hello world!".
    """
    hello: String!

    """
    Returns currently authenticated user and errors if there's no authenticated user.
    """
    user: User!

    """
    Fetches an object given its ID.
    """
    node(
      """
      ID of the object.
      """
      id: ID!
    ): Node

    """
    Returns a list of comics from the Marvel universe.
    """
    comics(pagination: Pagination): [Comic!]!

    """
    Returns a list of characters from the Marvel universe.
    """
    characters(pagination: Pagination): [Character!]!

    """
    Searches all characters and comics by name and returns those whose
    name starts with the query string.
    """
    search(query: Search!): [SearchResult!]!

    """
    Lets you see send messages from other people.
    """
    messages(pagination: Pagination): [Message!]!
  }

  type Character implements Node {
    id: ID!

    name: String!
    description: String!

    """
    URL of the character image.
    """
    image: String!

    """
    Tells whether currently authenticated user has starred this character.

    NOTE: If there's no authenticated user, this field will always return false.
    """
    starred: Boolean!

    """
    List of comics that this character appears in.
    """
    comics: [Comic!]!
  }

  type Comic implements Node {
    id: ID!

    title: String!
    description: String!
    isbn: String!

    """
    URL of the thumbnail image.
    """
    thumbnail: String!

    pageCount: Int

    """
    Tells whether currently authenticated user has starred this comic.
    """
    starred: Boolean!

    """
    Characters that are mentioned in the story.
    """
    characters: [Character!]!
  }

  union SearchResult = Character | Comic

  # Mutation

  type Mutation {
    """
    Creates a random authentication session.
    """
    auth: AuthPayload!

    """
    Adds a star to a comic or a character.
    """
    star(id: ID!, item: Item): SearchResult!

    """
    Messages the forum.

    NOTE: Image should be the id of the uploaded file.
    """
    message(message: String!, image: ID): Message!

    """
    Creates a new upload URL for a file and returns an ID.

    NOTE: The file should be uploaded to the returned URL. If the user is not
    authenticated, mutation will throw an error.
    """
    uploadFile(contentType: String!, extension: String, folder: String!): File!
  }

  enum Item {
    CHARACTER
    COMIC
  }

  type AuthPayloadSuccess {
    token: String!
    user: User!
  }

  type AuthPayloadFailure {
    message: String!
  }

  union AuthPayload = AuthPayloadSuccess | AuthPayloadFailure

  type File implements Node {
    id: ID!
    url: String!
  }

  # Subscription

  type Subscription {
    """
    Returns the current time from the server and refreshes every second.
    """
    time: DateTime!

    """
    Triggered whene a new comment is added to the shared list of comments.
    """
    message: Message!
  }

  type Message implements Node {
    id: ID!

    date: DateTime!
    message: String!
    image: File!

    author: User!
  }
`

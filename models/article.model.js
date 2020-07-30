module.exports = mongoose => {
  const Article = mongoose.model(
    "article",
    mongoose.Schema(
      {
        title: String,
        content: String,
        description: String,
      },
      { timestamps: true }
    )
  );

  return Article;
};
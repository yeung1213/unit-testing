module.exports = mongoose => {
  const Article = mongoose.model(
    "article",
    mongoose.Schema(
      {
        title: String,
        content: String,
        writer: String,
      },
      { timestamps: true }
    )
  );

  return Article;
};
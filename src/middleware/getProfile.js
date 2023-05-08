module.exports = async function getProfile(req, res, next) {
  const { Profile } = req.app.get("models");
  const profile = await Profile.findOne({
    where: { id: req.headers["profile_id"] || 0 },
    raw: true,
  });

  if (!profile) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.profile = profile;
  next();
};

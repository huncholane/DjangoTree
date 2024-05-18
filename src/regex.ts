export default {
  projectName: /([^']+?)\.settings/,
  appContainer: /INSTALLED_APPS = \[([\s\S]*?)\]/,
  module: /'([\.\w]+)'/gm,
  model: /class (\w+).*models.Model.*:([\s\S]*?)\n\n/gm,
  modelField: /(\w+) = .*\.(\w*[(Field)|(ForeignKey)])/gm,
};

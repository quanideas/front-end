import slugifyLib from 'slugify';
export default function slugify(string) {
    return slugifyLib(string, {
        lower: true, // Convert to lower case
        strict: true, // Remove special characters
        locale: 'vi', // Set locale to Vietnamese
      });
  }
  
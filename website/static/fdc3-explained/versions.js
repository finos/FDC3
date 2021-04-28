export default function () {

  const versions = ["1.0", "1.1", "1.2"];

  let versionDropdown = document.getElementById("versions")

  // populate the version dropdown with the versions
  versions.forEach(version => {
    let option = document.createElement("option");
    option.text = version;
    option.value = version
    versionDropdown.add(option);
  })

}
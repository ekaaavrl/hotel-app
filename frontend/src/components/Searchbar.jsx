function SearchBar({ value, onChange }) {
    return (
        <input
            type="text"
            placeholder="Cari..."
            className="form-control"
            style={{ width: "200px" }}
            value={value}
            onChange={onChange}
        />
    );
}
export default SearchBar;

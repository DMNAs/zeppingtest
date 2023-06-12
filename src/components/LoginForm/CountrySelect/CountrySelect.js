import { memo, useState } from "react";
import './CountrySelect.css'
import Select, { components } from 'react-select'

const { Option } = components;

//componente override di react-select per mostrare bandiera e nome nella lista
function CountryOption({ data: { value, label }, ...props }) {
    return (
        <Option className='country-option text-gap flex-middle' {...props}>
            <img src={`/flags/${value}.svg`} alt='' ></img>
            {label}
        </Option>
    )
}
export default memo(function CountrySelect({ label = '', className = '', ...props }) {
    //stati per determinare se il campo di input è vuoto (per nascondere la label)
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState(null);
    
    return (
        <div className={`text-field ${className} ${selected || search ? '' : 'empty-field'}`}>
            <label>{label}</label>
            <Select {...props}
                name="country"
                clearable={false}
                className="menu-input country-select__container"
                classNamePrefix='country-select'
                options={[
                    { value: 'it', label: 'Italia' },
                    { value: 'fr', label: 'Francia' },
                    { value: 'de', label: 'Germania' }
                ]}
                onChange={setSelected}
                openMenuOnFocus={true}
                onInputChange={setSearch}
                components={{ Option: CountryOption }}
            ></Select>
        </div>

    );
})
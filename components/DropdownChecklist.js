import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  UIManager,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
// import reject from 'lodash/reject';
// import find from 'lodash/find';
// import get from 'lodash/get';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//import nodeTypes from './helpers/nodeTypes';

// set UIManager LayoutAnimationEnabledExperimental
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class DropdownChecklist extends Component {
  static propTypes = {
    // single: PropTypes.bool,
    // selectedItems: PropTypes.array,
    // items: PropTypes.array.isRequired,
    // uniqueKey: PropTypes.string,
    // tagBorderColor: PropTypes.string,
    // tagTextColor: PropTypes.string,
    // fontFamily: PropTypes.string,
    // tagRemoveIconColor: PropTypes.string,
    // onSelectedItemsChange: PropTypes.func.isRequired,
    // selectedItemFontFamily: PropTypes.string,
    // selectedItemTextColor: PropTypes.string,
    // itemFontFamily: PropTypes.string,
    // itemTextColor: PropTypes.string,
    // itemFontSize: PropTypes.number,
    // selectedItemIconColor: PropTypes.string,
    // searchIcon: nodeTypes,
    // searchInputPlaceholderText: PropTypes.string,
    // searchInputStyle: PropTypes.object,
    // selectText: PropTypes.string,
    // styleDropdownMenu: ViewPropTypes.style,
    // styleDropdownMenuSubsection: ViewPropTypes.style,
    // styleInputGroup: ViewPropTypes.style,
    // styleItemsContainer: ViewPropTypes.style,
    // styleListContainer: ViewPropTypes.style,
    // styleMainWrapper: ViewPropTypes.style,
    // styleRowList: ViewPropTypes.style,
    // styleSelectorContainer: ViewPropTypes.style,
    // styleTextDropdown: Text.propTypes.style,
    // styleTextDropdownSelected: Text.propTypes.style,
    // altFontFamily: PropTypes.string,
    // hideSubmitButton: PropTypes.bool,
    // hideDropdown: PropTypes.bool,
    // submitButtonColor: PropTypes.string,
    // submitButtonText: PropTypes.string,
    // textColor: PropTypes.string,
    // fontSize: PropTypes.number,
    // fixedHeight: PropTypes.bool,
    // hideTags: PropTypes.bool,
    // canAddItems: PropTypes.bool,
    // onAddItem: PropTypes.func,
    // onChangeInput: PropTypes.func,
    // displayKey: PropTypes.string,
    // textInputProps: PropTypes.object,
    // flatListProps: PropTypes.object
  };

  static defaultProps = {
    // single: false,
    // selectedItems: [],
    // items: [],
    // uniqueKey: '_id',
    // tagBorderColor: colorPack.primary,
    // tagTextColor: colorPack.primary,
    // fontFamily: '',
    // tagRemoveIconColor: colorPack.danger,
    // onSelectedItemsChange: () => {},
    // selectedItemFontFamily: '',
    // selectedItemTextColor: colorPack.primary,
    // searchIcon: defaultSearchIcon,
    // itemFontFamily: '',
    // itemTextColor: colorPack.textPrimary,
    // itemFontSize: 16,
    // selectedItemIconColor: colorPack.primary,
    // searchInputPlaceholderText: 'Search',
    // searchInputStyle: { color: colorPack.textPrimary },
    // textColor: colorPack.textPrimary,
    // selectText: 'Select',
    // altFontFamily: '',
    // hideSubmitButton: false,
    // submitButtonColor: '#CCC',
    // submitButtonText: 'Submit',
    // fontSize: 14,
    // fixedHeight: false,
    // hideTags: false,
    // hideDropdown: false,
    // onChangeInput: () => {},
    // displayKey: 'name',
    // canAddItems: false,
    // onAddItem: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      folded: true,
      // selector: false,
      selectedItems: []
    };
  }

  shouldComponentUpdate() {
    // console.log('Component Updating: ', nextProps.selectedItems);
    return true;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  _toggleFolded = () => { this.setState({ folded: !this.state.folded }); };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  
  render() {
    const {
      // selectedItems,
      // single,
      // fontFamily,
      // altFontFamily,
      // searchInputPlaceholderText,
      // searchInputStyle,
      // styleDropdownMenu,
      // styleDropdownMenuSubsection,
      // hideSubmitButton,
      // hideDropdown,
      // submitButtonColor,
      // submitButtonText,
      // fontSize,
      // textColor,
      // fixedHeight,
      // hideTags,
      // textInputProps,
      // styleMainWrapper,
      // styleInputGroup,
      // styleItemsContainer,
      // styleSelectorContainer,
      // styleTextDropdown,
      // styleTextDropdownSelected,
      // searchIcon
    } = this.props;
    const { selectedItems, folded } = this.state;

    // Eingeklappt
    return (
      // Generell / Eingeklappt
      <View style={{backgroundColor:'blue', margin:0}}>
        <TouchableWithoutFeedback onPress={this._toggleFolded} style={{backgroundColor:'gray'}}>
          <View style={{flex:1, flexDirection:'row', alignItems:'center', backgroundColor:'white', paddingLeft:7}}>
            <Text style={{flex:1, fontSize:16, color:'#a7a7a7'}} numberOfLines={1}>Typ</Text>
            <Icon name={folded ?'menu-right' :'menu-down'} style={{fontSize: 30, color:'#a7a7a7'}} />
          </View>
        </TouchableWithoutFeedback>
      
      {/* Ausgeklappt */}
      {folded ?null :(
          <View>
            <Text>Ausgeklappt</Text>
          </View>
        
      )}
      </View>
    //   <View
    //     style={[
    //       {
    //         flexDirection: 'column'
    //       } &&
    //         styleMainWrapper &&
    //         styleMainWrapper
    //     ]}
    //   >
    //     {selector ? (
    //       <View
    //         style={[
    //           styles.selectorView(fixedHeight),
    //           styleSelectorContainer && styleSelectorContainer
    //         ]}
    //       >
    //         <View
    //           style={[styles.inputGroup, styleInputGroup && styleInputGroup, {display:'none'}] /* - HIER - manuell Suchleiste ausgeblendet - HIER - */} 
    //         >
    //           {searchIcon}
    //           <TextInput
    //             autoFocus
    //             onChangeText={this._onChangeInput}
    //             onSubmitEditing={this._addItem}
    //             placeholder={searchInputPlaceholderText}
    //             placeholderTextColor={colorPack.placeholderTextColor}
    //             underlineColorAndroid="transparent"
    //             style={[searchInputStyle, { flex: 1 }]}
    //             value={searchTerm}
    //             {...textInputProps}
    //           />
    //           {hideSubmitButton && (
    //             <TouchableOpacity onPress={this._submitSelection}>
    //               <Icon
    //                 name="menu-down"
    //                 style={[
    //                   styles.indicator,
    //                   { paddingLeft: 15, paddingRight: 15 }
    //                 ]}
    //               />
    //             </TouchableOpacity>
    //           )}
    //           {!hideDropdown && (
    //             <Icon
    //               name="arrow-left"
    //               size={20}
    //               onPress={this._clearSelector}
    //               color={colorPack.placeholderTextColor}
    //               style={{ marginLeft: 5 }}
    //             />
    //           )}
    //         </View>
    //         <View
    //           style={{
    //             flexDirection: 'column',
    //             backgroundColor: '#fafafa'
    //           }}
    //         >
    //           <View style={styleItemsContainer && styleItemsContainer}>
    //             {this._renderItems()}
    //           </View>
    //           {!single && !hideSubmitButton && (
    //             <TouchableOpacity
    //               onPress={() => this._submitSelection()}
    //               style={[
    //                 styles.button,
    //                 { backgroundColor: submitButtonColor }
    //               ]}
    //             >
    //               <Text
    //                 style={[
    //                   styles.buttonText,
    //                   fontFamily ? { fontFamily } : {}
    //                 ]}
    //               >
    //                 {submitButtonText}
    //               </Text>
    //             </TouchableOpacity>
    //           )}
    //         </View>
    //       </View>
    //     ) : (
    //       <View>
    //         <View
    //           style={[
    //             {height:25}, /* - HIER - Höhe auf 25 fixiert - HIER -*/
    //             styles.dropdownView,
    //             styleDropdownMenu && styleDropdownMenu
    //           ]}
    //         >
    //           <View
    //             style={[
    //               styles.subSection,
    //               { paddingTop: 10, paddingBottom: 10 },
    //               styleDropdownMenuSubsection && styleDropdownMenuSubsection
    //             ]}
    //           >
    //             <TouchableWithoutFeedback onPress={this._toggleSelector}>
    //               <View
    //                 style={{
    //                   flex: 1,
    //                   flexDirection: 'row',
    //                   alignItems: 'center'
    //                 }}
    //               >
    //                 <Text
    //                   style={
    //                     !selectedItems || selectedItems.length === 0
    //                       ? [
    //                           {
    //                             flex: 1,
    //                             fontSize: fontSize || 16,
    //                             color:
    //                               textColor || colorPack.placeholderTextColor
    //                           },
    //                           styleTextDropdown && styleTextDropdown,
    //                           altFontFamily
    //                             ? { fontFamily: altFontFamily }
    //                             : fontFamily
    //                             ? { fontFamily }
    //                             : {}
    //                         ]
    //                       : [
    //                           {
    //                             flex: 1,
    //                             fontSize: fontSize || 16,
    //                             color:
    //                               textColor || colorPack.placeholderTextColor
    //                           },
    //                           styleTextDropdownSelected &&
    //                             styleTextDropdownSelected
    //                         ]
    //                   }
    //                   numberOfLines={1}
    //                 >
    //                   {this._getSelectLabel()}
    //                 </Text>
    //                 <Icon
    //                   name={hideSubmitButton ? 'menu-right' : 'menu-down'}
    //                   style={styles.indicator}
    //                 />
    //               </View>
    //             </TouchableWithoutFeedback>
    //           </View>
    //         </View>
    //         {!single && !hideTags && selectedItems.length ? (
    //           <View
    //             style={{
    //               flexDirection: 'row',
    //               flexWrap: 'wrap'
    //             }}
    //           >
    //             {this._displaySelectedItems()}
    //           </View>
    //         ) : null}
    //       </View>
    //     )}
    //   </View>
    );
  }
}
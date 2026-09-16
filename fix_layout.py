import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

# I need to find the Pagination card which currently is inside the gap-1 flex-col.
# And move it OUTSIDE of it.
# The gap-1 flex-col currently contains:
# 1. Tables Card
# 2. Procedimiento Card
# 3. Final Function Card
# 4. Pagination Card
#
# I need to close the gap-1 flex-col AFTER the Final Function Card, and then put the Pagination Card, with full border radius.

# The end of Final Function Card:
#                                 <div className="flex justify-end mt-4 border-t border-error-soft pt-4"> ... </button></div></div>)}
#                                 {showSolution ... )}
#                             </div>
# 
#                             <div className="relative group rounded-b-3xl rounded-t-none overflow-hidden w-full flex justify-center ...
# Let's match from the end of Final Function Card to the Pagination Card.
pattern = r'(                                \)\}\n                            </div>)\n\n                            <div className="relative group rounded-b-3xl rounded-t-none overflow-hidden w-full flex justify-center border border-white/5 shadow-\[0_8px_32px_rgba\(168,85,247,0\.15\)\] hover:shadow-\[0_8px_32px_rgba\(168,85,247,0\.3\)\] bg-\[#a855f7\]/10 hover:bg-\[#a855f7\]/15 backdrop-blur-md transition-all duration-500 p-6">\n<InductionCardEffect className="absolute inset-0 z-0 pointer-events-none" />\n<div className="relative z-10 flex w-full justify-center">\n                                <div className="flex items-center justify-center gap-4 w-full max-w-lg">\n                                    <button \n                                        onClick=\{prevProblem\}'

replacement = r'''\1
                            </div> {/* CIERRE DEL CONTENEDOR GAP-1 */}

                            {/* PAGINATION AISLADA */}
                            <div className="relative group rounded-3xl overflow-hidden w-full flex justify-center border border-white/5 shadow-[0_8px_32px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] bg-[#a855f7]/10 hover:bg-[#a855f7]/15 backdrop-blur-md transition-all duration-500 p-6">
                                <InductionCardEffect className="absolute inset-0 z-0 pointer-events-none" />
                                <div className="relative z-10 flex w-full justify-center">
                                <div className="flex items-center justify-center gap-4 w-full max-w-lg">
                                    <button 
                                        onClick={prevProblem}'''

nexo = re.sub(pattern, replacement, nexo)

# Now, we also need to change the borders for Tables and Final Function card as the user requested.
# "agregarle los bordes redondeados en la parte superior del card donde estan las tablas, y tambien agregarle los bordes redondeados en la parte inferior donde esta la card de la funcion final."
# Actually, I already added `rounded-t-3xl rounded-b-none` to Tables, and `rounded-none` to Final Function.
# If I just pulled Pagination out, the Final Function card is now the last element in the gap-1 container!
# So Final Function card MUST be `rounded-b-3xl rounded-t-none`!
nexo = nexo.replace('<div className="glass-panel rounded-none p-8 shadow-lg" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>\n                                <div className="flex items-center justify-center mb-6">\n                                    <h3 className="text-2xl font-bold text-text-main text-center flex items-center">Función Lógica Final {renderClearBtn(handleClearFinal)}</h3>',
'<div className="glass-panel rounded-b-3xl rounded-t-none p-8 shadow-lg" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>\n                                <div className="flex items-center justify-center mb-6">\n                                    <h3 className="text-2xl font-bold text-text-main text-center flex items-center">Función Lógica Final {renderClearBtn(handleClearFinal)}</h3>')


# We also need to make sure I don't have an extra closing div at the end since I closed gap-1 early.
# At the end of NexoLab.jsx before the rules modal:
#                             {/* Cierre del flex-col gap-1 */}
#                         </div>
#                     </div>
#                 </div>
# Wait, let's remove the extra closing div since I moved it up.
extra_div_pattern = r'                                </div>\n                            </div>\n</div> <!-- Closing gap-1 flex-col -->\n                        </div>\n\n                        </div>'
# Let's search for how the pagination block ends right now.
